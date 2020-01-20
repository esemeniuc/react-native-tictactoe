import React, {ReactChild, useReducer, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Dialog, Paragraph,
    Portal,
    Provider as PaperProvider,
    Surface,
    Title,
    TouchableRipple
} from 'react-native-paper';
import {chunk} from 'lodash';
import {SafeAreaProvider, useSafeArea} from 'react-native-safe-area-context';
import {isWin, isTie} from "./gameLogic";

function Cell(props: { state: string, clickHandler: () => void }) {
    return <TouchableRipple style={{flex: 1}} onPress={props.clickHandler}>
        <Surface style={styles.surface}>
            <Text>{props.state}</Text>
        </Surface>
    </TouchableRipple>
}

function GameEndDialog(props: {
    children: ReactChild,
    isVisible: boolean,
    dismissHandler: () => void,
    resetHandler: () => void
}) {
    return <Portal>
        <Dialog
            visible={props.isVisible}
            onDismiss={props.dismissHandler}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
                {/*{props.children}*/}
                <Image
                    style={{width: 50, height: 50}}
                    source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                />
                <Text>You won!</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button icon="camera" onPress={props.resetHandler}>New Game</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
}

//board state transitions
function reducer(state: Array<Array<string>>, action: { row: number, col: number, reset: boolean }): Array<Array<string>> {
    console.log("rc target: ", action.row, action.col);
    if (action.reset) {
        return chunk(Array(9).fill('_'), 3);
    }
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

function WinCard() {
    return <Card>
        <Card.Title title="Card Title" subtitle="Card Subtitle"
                    left={() => <Avatar.Icon icon="folder"/>}/>
        <Card.Content>
            <Title>Congrats</Title>
            <Paragraph>___ won!</Paragraph>
        </Card.Content>
        <Card.Cover source={{uri: 'https://picsum.photos/700'}}/>
        <Card.Actions>
            <Button>Cancel</Button>
            <Button>New</Button>
        </Card.Actions>
    </Card>
}

//Todo: add reset button
function App() {
    const insets = useSafeArea();
    const [isHideModal, setIsHideModal] = useState(false);
    const [board, dispatch] = useReducer(reducer, chunk(Array(9).fill('_'), 3));
    return <View style={{paddingTop: insets.top, flex: 1}}>
        <View style={{flex: 1}}>
            {board.map((row, r) =>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}} key={r}>
                    {
                        row.map((stateChar, c) =>
                            <Cell state={stateChar} clickHandler={() => dispatch({row: r, col: c, reset: false})}
                                  key={c}/>)
                    }
                </View>)}
        </View>
        <GameEndDialog isVisible={!isHideModal && (isWin(board) || isTie(board))}
                       dismissHandler={() => setIsHideModal(false)}
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
