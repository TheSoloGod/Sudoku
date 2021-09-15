import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, TextInput, FlatList } from "react-native";
import axios from 'axios';
import * as API from '../config/Api';

export default function HomeScreen() {
    const [board, setBoard] = useState([[0,0,0,0,9,0,0,7,0],[0,0,0,0,0,0,5,8,9],[0,0,0,2,0,0,1,0,0],[2,0,0,4,0,0,7,9,8],[4,5,7,8,0,0,0,6,0],[0,0,0,7,1,3,0,0,5],[0,0,1,6,0,0,9,0,7],[0,6,0,0,0,0,8,2,0],[0,8,2,5,0,4,6,1,0]]);
    const [board_draft, setBoardDraft] = useState([])
    const [selected, setSelected] = useState('')
    // setBoardDraft(board)
    const numColumns = 9
    const numColumns2 = 1

    useEffect(() => {
        axios.get(API.GET_RANDOM_BOARD('easy'))
            .then(res => {
                // setBoard(res.data.board);
                // setBoardDraft(res.data.board)
                setBoardDraft(board)
            })
    }, []);
    const arrayClone = (arr) =>  {
        var i, copy;

        if( Array.isArray( arr ) ) {
            copy = arr.slice( 0 );
            for( i = 0; i < copy.length; i++ ) {
                copy[ i ] = arrayClone( copy[ i ] );
            }
            return copy;
        } else if( typeof arr === 'object' ) {
            throw 'Cannot clone array containing an object!';
        } else {
            return arr;
        }
    }
    const WIDTH = Dimensions.get('window').width;
    const renderItem = ({item, index}) => {
        let group_index = index;
        return(
            <View style={{
                    borderColor: 'black',
                    borderWidth: 1
                        }}>
                <FlatList data={item} renderItem={({item, index}) => rendercell(item, index, group_index)} horizontal={true}/>
            </View>
        )
    }
    const rendercell = (item, index, group) => {
        return(
          <View>
              {
                  item === board[group][index] && item !== 0
                    ?

                    <View style={{
                        width: WIDTH * 0.9 / 9,
                        height: WIDTH * 0.9 / 9,
                        borderColor: 'black',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'cyan',
                    }}>
                        <Text>
                            {item + ' ' + board_draft[group][index]}

                        </Text>
                    </View>
                    :
                    <TouchableOpacity style={{
                        width: WIDTH * 0.9 / 9,
                        height: WIDTH * 0.9 / 9,
                        borderColor: 'black',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${group}-${index}` === selected ? 'red' : 'white',
                    }}
                    onPress={()=> {
                        setSelected(`${group}-${index}`)
                    }}>
                    </TouchableOpacity>
              }
          </View>
        )
    }
    return (
        <SafeAreaView>
                <View style={{
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    {/*{renderBoard(board)}*/}
                    <FlatList data={board_draft} renderItem={renderItem} />
                    <TouchableOpacity onPress={() => {
                        let draft_clone = arrayClone(board_draft)
                        let x = selected.split('-')[0];
                        let y = selected.split('-')[1];
                        draft_clone[x][y] = 8;
                        console.log(board);
                        console.log(board_draft);
                        console.log(draft_clone);
                        setBoardDraft(draft_clone);
                        // setBoard(draft_clone)
                        // console.log(board);
                        // console.log(board_draft);
                    }}>
                        <Text>
                            0
                        </Text>
                    </TouchableOpacity>
                </View>

        </SafeAreaView>
    );

}
