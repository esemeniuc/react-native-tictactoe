import React, {useReducer} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {chunk} from 'lodash';

function Cell(props: { state: string, clickHandler: () => void }) {
    return <Text onPress={props.clickHandler}>{props.state}</Text>;
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

export default function App() {
    const [board, dispatch] = useReducer(reducer, chunk(Array(9).fill('_'), 3));
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            {board.map((row, r) =>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}} key={r}>
                    {
                        row.map((stateChar, c) => <Cell state={stateChar}
                                                        clickHandler={() => dispatch({row: r, col: c})}
                                                        key={c}/>)
                    }
                </View>
            )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'stretch',
        justifyContent: 'space-evenly'
    }
});
