import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, TextInput, FlatList} from 'react-native';
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

    useEffect(() => {
        axios.get(API.GET_RANDOM_BOARD('easy'))
            .then(res => {
                let board_data = res.data;
                setBoardOrigin(board_data);
                setBoard(board_data.board);
                setBoardDraft(board_data.board);
            })
    }, []);

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

    const renderBoard = (board) => {
        return (
            <View style={{
                borderColor: 'black',
                borderWidth: 2
            }}>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        {renderGroup(board[0], 0)}
                    </View>
                    <View>
                        {renderGroup(board[1], 1)}
                    </View>
                    <View>
                        {renderGroup(board[2], 2)}
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        {renderGroup(board[3], 3)}
                    </View>
                    <View>
                        {renderGroup(board[4], 4)}
                    </View>
                    <View>
                        {renderGroup(board[5], 5)}
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        {renderGroup(board[6], 6)}
                    </View>
                    <View>
                        {renderGroup(board[7], 7)}
                    </View>
                    <View>
                        {renderGroup(board[8], 8)}
                    </View>
                </View>
            </View>
        );
    };

    const renderGroup = (group, index_group) => {
        return (
            <View style={{
                borderColor: 'black',
                borderWidth: 1
            }}>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        {renderCell(group[0], index_group, 0)}
                    </View>
                    <View>
                        {renderCell(group[1], index_group, 1)}
                    </View>
                    <View>
                        {renderCell(group[2], index_group, 2)}
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        {renderCell(group[3], index_group, 3)}
                    </View>
                    <View>
                        {renderCell(group[4], index_group, 4)}
                    </View>
                    <View>
                        {renderCell(group[5], index_group, 5)}
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View>
                        {renderCell(group[6], index_group, 6)}
                    </View>
                    <View>
                        {renderCell(group[7], index_group, 7)}
                    </View>
                    <View>
                        {renderCell(group[8], index_group, 8)}
                    </View>
                </View>
            </View>
        );
    };

    const renderCell = (cell, index_group, index_cell) => {
        return (
            <View>
                {
                    cell == 0
                    ?
                        <View style={{
                            width: WIDTH * 0.9 / 9,
                            height: WIDTH * 0.9 / 9,
                            borderColor: 'black',
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: board[index_group][index_cell] == 0 ? 'white' : 'gray',
                        }}>
                            <TextInput
                                style={{
                                    padding: 0,
                                }}
                                defaultValue={board[index_group][index_cell].toString()}
                                textAlign={'center'}
                                maxLength={1}
                                keyboardType={'number-pad'}
                                onChangeText={text => {
                                    let board_clone = [...board];
                                    board_clone[index_group][index_cell] = text;
                                    setBoard(board_clone);
                                }}
                            />
                        </View>
                        :
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
                                {cell}
                            </Text>
                        </View>
                }
            </View>
        );
    };

    const renderNumbersPad = ({item}) => {
        return (
            <TouchableOpacity
                style={{
                    width: WIDTH * 0.9 / 9,
                    height: WIDTH * 0.9 / 9,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#dedede',
                    borderColor: 'black',
                    borderWidth: 1
                }}
                onPress={() => {

                }}
            >
                <Text>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView>
                <View style={{
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    {renderBoard(board)}
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
