import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, TextInput} from 'react-native';
import axios from 'axios';
import * as API from '../config/Api';

export default function HomeScreen() {
    const [board, setBoard] = useState([[0,0,0,0,9,0,0,7,0],[0,0,0,0,0,0,5,8,9],[0,0,0,2,0,0,1,0,0],[2,0,0,4,0,0,7,9,8],[4,5,7,8,0,0,0,6,0],[0,0,0,7,1,3,0,0,5],[0,0,1,6,0,0,9,0,7],[0,6,0,0,0,0,8,2,0],[0,8,2,5,0,4,6,1,0]]);

    useEffect(() => {
        axios.get(API.GET_RANDOM_BOARD('easy'))
            .then(res => {
                // setBoard(res.data.board);
            })
    }, []);

    const WIDTH = Dimensions.get('window').width;

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

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{
                    alignItems: 'center',
                    marginVertical: 20
                }}>
                    {renderBoard(board)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
