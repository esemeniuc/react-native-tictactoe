import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {range} from 'lodash';

function Cell(props: { a: string }) {
    return <div>{props.a}</div>;
}

export default function App() {
    console.log(styles);
    const [board, setBoard] = useState<Array<Array<string>>>(Array(3).fill(Array(3).fill('x')));
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <table>
                <tbody>
                {board.map(row =>
                    <tr>
                        {row.map(stateChar => <td><Cell a={stateChar}/></td>)}
                    </tr>)
                }
                </tbody>
            </table>
        </View>
    );
}

// const styles2 = StyleSheet.create({
//     div: {
//         backgroundColor: '#fff',
//
//         // borderWidth: 1,
//         // borderColor: 'black',
//         // borderStyle: 'solid',
//     },
// });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    td: {
        backgroundColor: '#fff',
        //
        //     // borderWidth: 1,
        //     // borderColor: 'black',
        //     // borderStyle: 'solid',
    },
});
