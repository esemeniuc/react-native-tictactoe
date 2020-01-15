import React, {useReducer} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Appbar, Provider as PaperProvider, Button} from 'react-native-paper';
import {chunk} from 'lodash';
// import ButtonExample from "./Button";
import {SafeAreaProvider, SafeAreaView, useSafeArea} from 'react-native-safe-area-context';

function Cell(props: { state: string, clickHandler: () => void }) {
    return <Button onPress={props.clickHandler}>{props.state}</Button>;
    // return <Text onPress={props.clickHandler}>{props.state}</Text>;
}

//check diagonals, and along col and row
function isWin(state: Array<Array<string>>): boolean {
    for (let i = 0; i < 3; i++) {
        if ((state[i][0] === state[i][1] && state[i][1] === state[i][2] && state[i][0] !== '_') ||
            (state[0][i] === state[1][i] && state[1][i] === state[2][i] && state[0][i] !== '_')) {
            return true;
        }
    }
    return ((state[0][0] === state[1][1] && state[1][1] === state[2][2]) || //cross
        (state[2][0] === state[1][1] && state[1][1] === state[0][2])) && state[1][1] !== '_';
}

//all spaces are set is a tie
function isTie(state: Array<Array<string>>): boolean {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '_') {
                return false;
            }
        }
    }
    return true;
}

function reducer(state: Array<Array<string>>, action: { row: number, col: number }): Array<Array<string>> {
    console.log("rc target: ", action.row, action.col);
    switch (state[action.row][action.col]) {
        case 'x':
            state[action.row][action.col] = 'o';
            return [...state];
        case 'o':
            state[action.row][action.col] = '_';
            return [...state];
        case '_':
            state[action.row][action.col] = 'x';
            return [...state];
        default:
            throw new Error();
    }
}

function App() {
    const insets = useSafeArea();
    const [board, dispatch] = useReducer(reducer, chunk(Array(9).fill('_'), 3));
    return <View style={{
        paddingTop: insets.top,
        flex: 1
    }}>
        {/*<ButtonExample/>*/}
        <Text>Open up App.tsx to start working on your app!</Text>
        <View style={{flex: 1,}}>
            {board.map((row, r) =>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}} key={r}>
                    {
                        row.map((stateChar, c) => <Cell state={stateChar}
                                                        clickHandler={() => dispatch({row: r, col: c})}
                                                        key={c}/>)
                    }
                </View>)}
        </View>
        <Text>Status: {isWin(board) ? "you win!" : (isTie(board) && "a tie!")}</Text>
        <Appbar style={stylesAppbar.bottom}>
            <Appbar.Action icon="archive" onPress={() => console.log('Pressed archive')}/>
            <Appbar.Action icon="label" onPress={() => console.log('Pressed label')}/>
            <Appbar.Action icon="delete" onPress={() => console.log('Pressed delete')}/>
        </Appbar>
    </View>
}

const stylesAppbar = StyleSheet.create({
    bottom: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default function Main() {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <App/>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
