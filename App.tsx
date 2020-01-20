import React, {useReducer, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
    Appbar,
    Avatar,
    Button,
    Dialog,
    Portal,
    Provider as PaperProvider,
    Surface,
    TouchableRipple
} from 'react-native-paper';
import {chunk} from 'lodash';
import {SafeAreaProvider, useSafeArea} from 'react-native-safe-area-context';
import {BoardSelection, getWinner, Winner} from "./gameLogic";

function Cell(props: { state: BoardSelection, clickHandler: () => void }) {
    return <TouchableRipple style={{flex: 1}} onPress={props.clickHandler}>
        <Surface style={styles.surface}>
            <Text style={{fontSize: 144}}>{
                props.state === BoardSelection.X ? "X" :
                    props.state === BoardSelection.O ? "O" :
                        <Text style={{color: "#A0A0A0"}}>_</Text>}
            </Text>
        </Surface>
    </TouchableRipple>
}

function GameEndDialog(props: {
    isVisible: boolean,
    winner: Winner,
    dismissHandler: () => void,
    restartHandler: () => void
}) {
    return <Portal>
        <Dialog
            visible={props.isVisible}
            onDismiss={props.dismissHandler}>
            <Dialog.Title>
                {props.winner === Winner.X ? "X Won!" :
                    props.winner === Winner.O ? "O Won!" :
                        "A Tie!"
                }
            </Dialog.Title>
            <Dialog.Content>
                {props.winner === Winner.X ? <WinCard winner="X"/> :
                    props.winner === Winner.O ? <WinCard winner="O"/> :
                        <><Avatar.Icon icon="scale-balance"/>
                            <Text>Play again to find the winner!</Text></>
                }
            </Dialog.Content>
            <Dialog.Actions>
                <Button icon="restart" onPress={props.restartHandler}>New Game</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
}

//board state transitions
function reducer(state: Array<Array<BoardSelection>>, action: { row: number, col: number, reset: boolean }): Array<Array<BoardSelection>> {
    console.log("rc target: ", action.row, action.col);
    if (action.reset) {
        return chunk(Array(9).fill(BoardSelection.NONE), 3);
    }
    switch (state[action.row][action.col]) {
        case BoardSelection.X:
            state[action.row][action.col] = BoardSelection.O;
            return [...state];
        case BoardSelection.O:
            state[action.row][action.col] = BoardSelection.NONE;
            return [...state];
        case BoardSelection.NONE:
            state[action.row][action.col] = BoardSelection.X;
            return [...state];
        default:
            throw new Error();
    }
}

function WinCard(props: { winner: string }) {
    return <><Avatar.Icon icon="trophy"/>
        <Text>Congratulations player {props.winner}!</Text></>
}

function App() {
    const [isHideModal, setIsHideModal] = useState(false);
    const [board, dispatch] = useReducer(reducer, chunk(Array(9).fill(BoardSelection.NONE), 3));
    const winner = getWinner(board);
    const insets = useSafeArea();
    const restartHandler = () => {
        setIsHideModal(false);
        dispatch({row: 0, col: 0, reset: true});
    };
    return <View style={{paddingTop: insets.top, flex: 1}}>
        <View style={{flex: 1}}>
            {board.map((row, r) =>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}} key={r}>
                    {
                        row.map((selection, c) =>
                            <Cell state={selection} clickHandler={() => dispatch({row: r, col: c, reset: false})}
                                  key={c}/>)
                    }
                </View>)}
        </View>
        <GameEndDialog isVisible={winner !== Winner.NONE && !isHideModal}
                       winner={winner}
                       dismissHandler={() => setIsHideModal(true)}
                       restartHandler={restartHandler}/>
        <Appbar style={styles.bottom}>
            <Appbar.Action icon="restart" onPress={restartHandler}/>
            <Appbar.Action icon="help" onPress={() => console.log('Pressed archive')}/>
        </Appbar>
    </View>
}

const styles = StyleSheet.create({
    bottom: {
        left: 0,
        right: 0,
        bottom: 0,
    },
    surface: {
        margin: 4,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
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
