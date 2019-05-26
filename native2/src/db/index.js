
import { openDatabase } from 'react-native-sqlite-storage';

// ----------------------------------------------------------------------------
// util
// ----------------------------------------------------------------------------

async function async_sleep(ms) {
    await _async_sleep_impl(ms);
}

function _async_sleep_impl(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ----------------------------------------------------------------------------
// SQL PREPARE
// ----------------------------------------------------------------------------

/*
    schema := [{name: str, columns: {[{name: str, type: str}, ...]}, ...]
*/
export function sql_prepare_schema(schema) {
    var statements = [];
    for (var i=0; i < schema.length; i++) {
        var tbl = schema[i];

        var table = "CREATE TABLE IF NOT EXISTS " + tbl.name;

        var columns = tbl.columns.map(col => col.name + " " + col.type).join(', ');

        //statements.push({sql: "DROP TABLE IF EXISTS " + tbl.name, params: []});

        statements.push({sql: table + "(" + columns + ")", params: []});
    }
    return statements;
}

/*
prepare an insert statement for a single json document
*/
export function sql_prepare_insert(table, coldef, value) {

    var params = []
    var columns = ""
    var template = ""
    for (var i=0; i < coldef.length; i++) {

        if (coldef[i].name == 'spk') {
            continue;
        }

        if (template !== "") {
            columns += ", "
            template += ", ?"
        } else {
            template = "?"
        }

        columns += coldef[i].name
        var k = value[coldef[i].name]

        params.push(k !== undefined?k:null)

    }

    var sql = "INSERT INTO " + table + "(" +
        columns + ")" + " VALUES (" + template + ")";

    return {sql, params}
}

/*
prepare an insert statement for multiple json documents
*/
export function sql_prepare_insert_bulk(table, coldef, values) {

    var params = []
    var columns = ""
    var template = ""

    for (var i=0; i < coldef.length; i++) {

        if (coldef[i].name == 'spk') {
            continue;
        }

        if (template !== 'spk') {
            columns += ", "
            template += ", ?"
        } else {
            template = "?"
        }

        columns += coldef[i].name
    }

    template = "(" + template + ")"
    var sql = "INSERT INTO " + table + "(" +
        columns + ")" + " VALUES ";

    sql += values.map((item) => template).join(", ")

    for (var i=0; i < values.length; i++) {

        for (var j=0; j < coldef.length; j++) {
            if (coldef[j].name == 'spk') {
                continue;
            }
            var k = values[i][coldef[j].name]
            params.push(k !== undefined?k:null)
        }
    }

    return {sql, params}

}

export function sql_prepare_update(table, coldef, spk_or_npk, value) {

    var params = []
    var columns = ""
    var template = ""
    for (var i=0; i < coldef.length; i++) {

        // cannot update spk!
        if (coldef[i].name == 'spk') {
            continue;
        }

        var k = value[coldef[i].name]

        if (k !== undefined) {

            if (params.length > 0) {
                columns += ", "
                template += ", ?"
            } else {
                template = "?"
            }

            columns += coldef[i].name

            params.push(k)

        }
    }

    var clause;
    if (typeof(spk_or_npk) === 'number') {
        clause = table + ".spk == ?"
        params.push(spk_or_npk)
    } else if (typeof(spk_or_npk) === 'object') {
        clause = Object.keys(spk_or_npk).map((key) => {
            params.push(spk_or_npk[key])
            return key + " == ?"
        }).join(" && ")
    } else {
        throw "primary key is not a number (spk) or object (npk)!";
    }

    var sql = "UPDATE " + table + " SET (" +
        columns + ") = (" + template + ") WHERE (" + clause + ")";

    return {sql, params}

}

export function sql_prepare_update_bulk(coldef, spk, values) {
    // this doesnt actually make sense
}

export function sql_prepare_upsert_select(table, coldef, npk) {

    var items = []
    var params = []

    var clause = Object.keys(npk).map((key) => {
        params.push(npk[key])
        return key + " == ?"
    }).join(" && ")

    var sql = "SELECT * FROM " + table +
        " WHERE (" + clause + ") LIMIT 1"

    return {sql, params}
}

export function sql_prepare_delete(table, spk) {

    var sql = " DELETE FROM " + table + "WHERE (spk == ?)"
    var params = [spk]
    return {sql, params}
}

export function sql_prepare_delete_bulk(table, spks) {

    var template = spks.map((item) => "?").join(", ")
    var sql = " DELETE FROM " + table + "WHERE spk in (" + template + ")";
    var params = [...spks];
    return {sql, params}
}


// ----------------------------------------------------------------------------
// SQL ASYNC
// ----------------------------------------------------------------------------

// async open database
// return a new db connection on success
export async function connect(opts) {
    var db = await new Promise((resolve, reject) => {
        var db_ = openDatabase(opts,
            () => { resolve(db_) },
            () => { reject() }
        )
    })
    return db
}

// async create transaction
export async function transaction(db) {
    var tx = await new Promise((resolve, reject) => {
        db.transaction(resolve, reject)
    })
    return tx
}

// async execute statement
// return a result proxy on success
export async function execute(db, sql, params) {

    const tx = await transaction(db)
    console.log("statement: " + sql)
    console.log("parameters: " + JSON.stringify(params))

    return await new Promise((resolve, reject) => {
        tx.executeSql(sql, params, (tx_, result) => {
            resolve(result)
        }, (e) => {
            reject(e)
        })
    })
}

// async execute mutliple statements sequentially
// return a result proxy for each statement on success
export async function execute_many(db, statements) {

    results = []
    for (var i=0; i < statements.length; i++) {
        var statement = statements[i]
        var result = await execute(db, statement.sql, statement.params);
        results.push(result)
    }

    return results
}


// ----------------------------------------------------------------------------
// SQL UTIL
// ----------------------------------------------------------------------------


// npk: natural primary key as keyed object {column_name: value}
//      e.g. {uid: <uid>}
async function _upsert(db, tbl_name, tbl_cols, npk, value) {

    result = await db.execute_single(sql_prepare_upsert_select(tbl_name, tbl_cols, npk))

    if (result.rows.length == 1) {
        var item = result.rows.item(0);
        // update
        return await db.execute_single(db.prepare.update(tbl_name, tbl_cols, item.spk, value))
    } else {
        // insert
        return await db.execute_single(db.prepare.insert(tbl_name, tbl_cols, value))
    }
}

// ----------------------------------------------------------------------------
// ORM ASYNC
// ----------------------------------------------------------------------------

export async function dbconnect(opts) {

    var connection = new Object();

    connection.db = await connect(opts);

    connection.transaction = async () => {return transaction(connection.db);}
    connection.execute = async (sql, params) => {return execute(connection.db, sql, params);}
    connection.execute_single = async (statement) => {return execute(connection.db, statement.sql, statement.params);}
    connection.execute_many = async (statements) => {return execute_many(connection.db, statements);}

    connection.prepare = new Object();
    connection.prepare.schema = (schema) => sql_prepare_schema(schema);
    connection.prepare.insert = (tbl_name, coldef, value) => sql_prepare_insert(tbl_name, coldef, value);
    connection.prepare.insert_bulk = (tbl_name, coldef, values) => sql_prepare_insert_bulk(tbl_name, coldef, values);

    connection.prepare.update = (tbl_name, coldef, spk_or_npk, value) => sql_prepare_update(tbl_name, coldef, spk_or_npk, value);

    connection.prepare.delete = (tbl_name, spk) => sql_prepare_delete(tbl_name, spk);
    connection.prepare.delete_bulk = (tbl_name, spks) => sql_prepare_delete_bulk(tbl_name, spks);

    return connection
}

function _dbinit_table(db, tbl) {
    var col = new Object()
    db.tables[tbl.name] = col;

    col.insert = async (value) => db.execute_single(db.prepare.insert(tbl.name, tbl.columns, value))
    col.insert_bulk = async (values) => db.execute_single(db.prepare.insert_bulk(tbl.name, tbl.columns, values))

    col.update = async (spk_or_npk, value) => db.execute_single(db.prepare.update(tbl.name, tbl.columns, spk_or_npk, value))

    col.upsert = async (npk, value) => _upsert(db, tbl.name, tbl.columns, npk, value)

    col.delete = async (spk) => db.execute_single(db.prepare.delete(tbl.name, spk))
    col.delete_bulk = async (spks) => db.execute_single(db.prepare.delete_bulk(tbl.name, spks))

    col.count = async () => _count(db, tbl.name)
}

export async function dbinit(opts, schema) {

    var db = await dbconnect(opts);

    var statements = db.prepare.schema(schema)

    await db.execute_many(statements)

    db.tables = new Object();
    db.t = db.tables

    // construct objects representing tables
    for (var i=0; i < schema.length; i++) {
        _dbinit_table(db, schema[i])
    }

    return {db, result: null};
}

async function _count(db, tbl_name) {
    var result = await db.execute("SELECT COUNT(*) FROM " + tbl_name, [])
    return result.rows.item(0)['COUNT(*)']
}



// ----------------------------------------------------------------------------
// REDUX
// ----------------------------------------------------------------------------