# React-Redux-Saga

A state container using Saga to allow for concurrent, asynchronous actions.


## Adding a new Action

1. update ./constants.js
    add a new constant to represent the action to perform
2. add a source file and function for the action in ./actions.
    an action is a function which accepts parameters and returns a new object. This object must have a 'type' attribute, which will be set to the constant defined in step 1.
3. create a reducer, adding a source file and function under ./reducers
    The reducer is a function which uses a switch case to perform some task on an action, based on the action type.
    The reducer should define the initial state, and return the new state
4. update ./reducer/index.js to utilize the new reducer

At this point, connecting the action function to a React.Component through the use of bind actions will trigger the reducer function, resulting in property changes.

## Adding a new Saga

1. update ./constants.js
    add a new constant to represent the action to perform, and additional constants to represent the intermediate states. For example, TRIGGER, SUCCESS, FAILURE
2. add a source file and function for the action in ./actions.
    an action is a function which accepts parameters and returns a new object. This object must have a 'type' attribute, which will be set to the constant used to trigger a saga defined in step 1.
3. create a reducer, adding a source file and function under ./reducers
    The reducer is a function which uses a switch case to perform some task on an action, based on the action type.
    The reducer should define the initial state, and return the new state
    Note: it is likey the case that the trigger state will not modify the state, the trigger case can thus be omitted.
4. update ./reducer/index.js to utilize the new reducer
5. create a function to handle the action when it is triggerd.
   The action argument is the action returned by the method created in step 2. The function can yield additional actions to indicate state transitions.
6. update ./sagas/index.js to utilize the new saga
   The callable-object returned by redux-saga/effects.takeEvery should be registered within the yield all([]) block.

Multiple Sagas can be triggered concurrently.
For example, this allows for concurrently loading data in a list view.
