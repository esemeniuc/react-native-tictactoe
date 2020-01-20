import React, {ReactChild, useReducer, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, Dialog, Portal, Provider as PaperProvider, Surface, TouchableRipple} from 'react-native-paper';
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
    children: ReactChild,
    isVisible: boolean,
    winner: Winner,
    dismissHandler: () => void,
    resetHandler: () => void
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
            <Dialog.Content>{props.children}</Dialog.Content>
            <Dialog.Actions>
                <Button icon="restart" onPress={props.resetHandler}>New Game</Button>
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

function WinCard() {
    return <>
        {/*<Image*/}
        {/*    style={{width: 50, height: 50}}*/}
        {/*    source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}*/}
        {/*/>*/}
        <Avatar.Icon icon="trophy"/>
        <Text>You won!</Text>
    </>
}

//Todo: add reset button
function App() {
    const [isHideModal, setIsHideModal] = useState(false);
    const [board, dispatch] = useReducer(reducer, chunk(Array(9).fill(BoardSelection.NONE), 3));
    const winner = getWinner(board);
    const insets = useSafeArea();
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
                       resetHandler={() => {
                           setIsHideModal(false);
                           dispatch({row: 0, col: 0, reset: true});
                       }}>
            <WinCard/>
        </GameEndDialog>
        {/*<Text style={{flex: 1}}>Status: {isWin(board) ? "you win!" : (isTie(board) && "a tie!")}</Text>*/}
        {/*<Appbar style={styles.bottom}>*/}
        {/*    <Appbar.Action icon="archive" onPress={() => console.log('Pressed archive')}/>*/}
        {/*    <Appbar.Action icon="label" onPress={() => console.log('Pressed label')}/>*/}
        {/*    <Appbar.Action icon="delete" onPress={() => console.log('Pressed delete')}/>*/}
        {/*</Appbar>*/}
    </View>
}

const styles = StyleSheet.create({
    bottom: {
        flex: 1,
        position: 'absolute',
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
