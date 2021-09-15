import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, TextInput, FlatList } from "react-native";
import axios from 'axios';
import * as API from '../config/Api';

export default function HomeScreen() {
    const WIDTH = Dimensions.get('window').width;
    const board_reset = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
    const [board_origin, setBoardOrigin] = useState();
    const [board, setBoard] = useState(board_reset);
    const [board_draft, setBoardDraft] = useState(board_reset);
    const [board_resolved, setBoardResolved] = useState([]);
    const numbers_pad = [1,2,3,4,5,6,7,8,9];
    const [selected, setSelected] = useState('')

    useEffect(() => {
        axios.get(API.GET_RANDOM_BOARD('easy'))
            .then(res => {
                let board_data = res.data;
                setBoardOrigin(board_data);
                setBoard(board_data.board);
                setBoardDraft(board_data.board);
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

    useEffect(() => {
        if (board_origin) {
            let params_encode = encodeParams(board_origin);
            axios.post(API.SOLVE_BOARD, params_encode, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .then(res => {
                    setBoardResolved(res.data.board);
                })
        }
    }, [board_origin]);

    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')

    const encodeParams = (params) =>
        Object.keys(params)
            .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
            .join('&');
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
          <View style={{
            width: WIDTH,
            alignItems: 'center',
          }}>
            <FlatList
              data={numbers_pad}
              renderItem={renderNumbersPad}
              ItemSeparatorComponent={() => {return (<View style={{width: WIDTH * 0.01}}/>)}}
              horizontal={true}
            />
          </View>
        </SafeAreaView>
    );

}
