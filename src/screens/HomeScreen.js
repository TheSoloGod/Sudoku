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
    const [wrongNums, SetWrongNum] = useState('')
    let x =''
    let y =''
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
    const getXY = () =>{
       x = selected.split('-')[0];
       y = selected.split('-')[1];
    }

    useEffect(() => {
        if (board_origin) {
            let params_encode = encodeParams(board_origin);
            axios.post(API.SOLVE_BOARD, params_encode, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .then(res => {
                    setBoardResolved(res.data.solution);
                  console.log(res.data.solution);
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
        // borderWidth: 1
      }}>
        <FlatList data={item} renderItem={({item, index}) => rendercell(item, index, group_index)} horizontal={true}/>
      </View>
    )
  }
  const rendercell = (item, index, group) => {
    let borderBot = 0;
    let borderRight = 0;
    let borderLeft = 0;
    let borderTop = 0;
    if(group === 2 || group === 5 || group === 8 ){
      borderBot = 4
    }
    if (index === 2 || index === 5 || index === 8){
      borderRight = 4
    }
    // if (index === 0 || index === 3 || index === 7){
    //   borderLeft = 4
    // }
    // if (group === 0){
    //   borderTop = 4
    // }

    if(item === board[group][index] && item !== 0){
      return(
        <View style={{
                    width: WIDTH * 0.9 / 9,
                    height: WIDTH * 0.9 / 9,
                    borderColor: 'black',
                    borderBottomWidth: borderBot,
                    borderRightWidth : borderRight,
                    borderTopWidth: borderTop,
                    borderLeftWidth: borderLeft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'cyan',
                  }}>
                    <Text style={{
                      fontWeight :"bold"
                    }}>
                      {item}
                    </Text>
        </View>
      )
    }
    else if(item === 0){
      return(
      <TouchableOpacity style={{
                  width: WIDTH * 0.9 / 9,
                  height: WIDTH * 0.9 / 9,
                  borderColor: 'black',
                  // borderWidth: 1,
                  borderBottomWidth: borderBot,
                  borderRightWidth : borderRight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${group}-${index}` === selected ? 'yellow' : 'white',
                }}
                                  onPress={()=> {
                                    setSelected(`${group}-${index}`)
                                  }}>
                </TouchableOpacity>
      )
    }
    else{
      // if(wrongNums){
        return(
          <TouchableOpacity style={{
            width: WIDTH * 0.9 / 9,
            height: WIDTH * 0.9 / 9,
            borderColor: 'black',
            // borderWidth: 1,
            borderRightWidth : borderRight,
            borderBottomWidth: borderBot,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${group}-${index}` === selected ? 'yellow' : 'white',
          }}
                            onPress={()=> {
                              setSelected(`${group}-${index}`)
                            }}
          >
            <Text style={{
              fontWeight: "bold",
              color: `${group}-${index}` === wrongNums ? 'red': 'black'
            }}>
              {item}
            </Text>
          </TouchableOpacity>
        )
      // }
      // else{
      //   return(
      //     <TouchableOpacity style={{
      //       width: WIDTH * 0.9 / 9,
      //       height: WIDTH * 0.9 / 9,
      //       borderColor: 'black',
      //       borderWidth: 1,
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       backgroundColor: `${group}-${index}` === selected ? 'green' : 'white',
      //     }}
      //                       onPress={()=> {
      //                         setSelected(`${group}-${index}`)
      //                       }}
      //     >
      //       <Text>
      //         {item}
      //       </Text>
      //     </TouchableOpacity>
      //   )
      // }

    }
    // return(
    //   <View>
    //     {
    //
    //         ?
    //
    //         <View style={{
    //           width: WIDTH * 0.9 / 9,
    //           height: WIDTH * 0.9 / 9,
    //           borderColor: 'black',
    //           borderWidth: 1,
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           backgroundColor: 'cyan',
    //         }}>
    //           <Text>
    //             {item + ' ' + board_draft[group][index]}
    //
    //           </Text>
    //         </View>
    //         : item === 0 ?
    //         <TouchableOpacity style={{
    //           width: WIDTH * 0.9 / 9,
    //           height: WIDTH * 0.9 / 9,
    //           borderColor: 'black',
    //           borderWidth: 1,
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           backgroundColor: `${group}-${index}` === selected ? 'red' : 'white',
    //         }}
    //                           onPress={()=> {
    //                             setSelected(`${group}-${index}`)
    //                           }}>
    //         </TouchableOpacity>
    //         :
    //         <TouchableOpacity style={{
    //           width: WIDTH * 0.9 / 9,
    //           height: WIDTH * 0.9 / 9,
    //           borderColor: 'black',
    //           borderWidth: 1,
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           backgroundColor: `${group}-${index}` === selected ? 'red' : 'white',
    //         }}
    //                           onPress={()=> {
    //                             setSelected(`${group}-${index}`)
    //                           }}
    //         >
    //           <Text>
    //             {item}
    //           </Text>
    //         </TouchableOpacity>
    //     }
    //   </View>
    // )
  }
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
          let draft_clone = arrayClone(board_draft)
          getXY()
          draft_clone[x][y] = item;
          console.log(board);
          console.log(board_draft);
          console.log(draft_clone);
          setBoardDraft(draft_clone);
          console.log(board_resolved);
          if(draft_clone[x][y] !== board_resolved[x][y]){
            SetWrongNum(`${x}-${y}`)
          }
          else {
            SetWrongNum('')
          }
        }}
      >
        <Text>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

    return (
        <SafeAreaView >
                <View style={{
                  width: WIDTH,
                    alignItems: 'center',
                    borderWidth: 4,
                }}>
                    {/*{renderBoard(board)}*/}
                    <FlatList data={board_draft} renderItem={renderItem} keyExtractor={(item, index) => index + "id" } />
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
