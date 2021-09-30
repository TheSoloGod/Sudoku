import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Image, ImageBackground,
} from "react-native";
import axios from 'axios';
import * as API from '../config/Api';
import { addLog } from "react-native/Libraries/LogBox/Data/LogBoxData";
import Easy from "../data/sudokuEASY.json"
import Medium from "../data/sudokuMEDIUM.json"
import Hard from "../data/sudokuHARD.json"
import { useRoute } from "@react-navigation/native";
export default function GameScreen({navigation}) {
    const route = useRoute()
    const {level, index} = route.params
    const WIDTH = Dimensions.get('window').width;
    const board_reset = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
    const [board_origin, setBoardOrigin] = useState();
    const [board, setBoard] = useState([]);
    const [board_draft, setBoardDraft] = useState([]);
    const [board_resolved, setBoardResolved] = useState([]);
    const numbers_pad = [1,2,3,4,5,6,7,8,9];
    const [selected, setSelected] = useState('')
    const [wrongNums, SetWrongNum] = useState([])
    const [rightNums, setRightNums] = useState([])
    const [lives, setLives] = useState(3)
    const [gameid, setGameid] = useState('')
    const [finished, setFinished] = useState(false)
    let x =''
    let y =''
    const [hintNum, setHintNum] = useState(3)
    const [filledNum, setFilledNum] = useState(0)
    const [hidenNum, setHidenNum] = useState('')
    const [seconds, setSeconds ] =  useState(0);
    const intervalRef = useRef(null)
    useEffect(() => {
        // axios.get(API.GET_RANDOM_BOARD('easy'))
        //     .then(res => {
        //         let board_data = res.data;
        //         setBoardOrigin(board_data);
        //         setBoard(board_data.board);
        //         setBoardDraft(board_data.board);
        //         setHidenNum(countHideNum(board_data.board))
        //     })
      setSeconds(0)
      setLives(3)
      createGame()

    }, []);
    const createGame = () =>{
      let random = ''
      let puzzle_data = getPuzzleByLevel(level)
      let solution_data =  getSolutionByLevel(level)
      if(index == null){
        random = getRandom(puzzle_data.length)
      }
      else{
        random = index
      }
      setGameid(random)
      console.log(puzzle_data.length);
      let grid = puzzle_data[random]
      setBoard(grid)
      setBoardDraft(grid)
      setHidenNum(countHideNum(grid))
      console.log(countHideNum(grid));
      console.log(grid);
      // let solve = solution_data[random]
      let solve_grid = solution_data[random]
      setBoardResolved(solve_grid)
      console.log(solve_grid);
    }
    const getPuzzleByLevel = (level) => {
      switch (level){
        case 'EASY':
          return JSON.parse(JSON.stringify(Easy.puzzle))
      }
      switch (level){
        case 'MEDIUM':
          return JSON.parse(JSON.stringify(Medium.puzzle))
      }
      switch (level){
        case 'HARD':
          return JSON.parse(JSON.stringify(Hard.puzzle))
      }

  }
    const getSolutionByLevel = (level) => {
      switch (level){
        case 'EASY':
          return JSON.parse(JSON.stringify(Easy.solution))
      }
      switch (level){
        case 'MEDIUM':
          return JSON.parse(JSON.stringify(Medium.solution))
      }
      switch (level){
        case 'HARD':
          return JSON.parse(JSON.stringify(Hard.solution))
      }
    }
    useEffect(()=>{
      let interval = ''
      if (board.length !== 0){
        console.log(board.length)
        // setTimer()
          intervalRef.current = setInterval(() => {
            setSeconds(seconds => seconds + 1)
          }, 1000);
          // setStateIn(interval)
        return () => clearInterval(intervalRef.current)
      }
      return () => clearInterval(intervalRef.current)
    }, [board]);
    const getRandom = (length) =>{
      return Math.floor(Math.random() * length);
    }
    const stopTimer = () =>{
      clearInterval(intervalRef.current)
      intervalRef.current=null
    }
    // const clearInterval = clearInterval()

    const formatTime = (seconds) =>{
      let minutes = Math.floor(seconds/60)
      let secondsF  = seconds % 60
      if(secondsF < 10) {
        return `${minutes}:0${secondsF}`
      }
      return `${minutes}:${secondsF}`
    }
    // useEffect(() => {
    //   if (board_origin) {
    //     let params_encode = encodeParams(board_origin);
    //     axios.post(API.SOLVE_BOARD, params_encode, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    //       .then(res => {
    //         setBoardResolved(res.data.solution);
    //         console.log(res.data.solution);
    //       })
    //   }


  // }, [board_origin]);
    useEffect(() => {
      if(lives === 0){
        stopTimer()
        LosedAlert()
      }

      if(filledNum === hidenNum) {
        setFinished(true)
        setSelected('')
        stopTimer()
        SuccessAlert()
      }
    }, [filledNum, lives]);
    const LosedAlert = () => Alert.alert(
      "Game Over",
      "You have played " + formatTime(seconds),
      [
        {
          text: "Restart",
          onPress: () => {
            navigation.replace('Game', {
              level: level,
              index: gameid
            })
          },

        },
        {
          text: "New Game", onPress: () => {
            navigation.navigate('Home', {
            })
          }
        }
      ]
    );
    const SuccessAlert = () =>
      Alert.alert(
        "Finished",
        "Congratulation!!! puzzle solved in " + formatTime(seconds),
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "New Game", onPress: () => {
              /* 1. Navigate to the Details route with params */
              navigation.navigate('Home', {
              })
            }
          }
        ]
      );
    const countHideNum = (data) => {
      let count = 0
      for (let i = 0; i <= 8; i++){
        for (let j = 0; j <= 8; j++){
          if (data[i][j] === 0){
            count++
          }
            }
      }
      console.log(count);
      return count
  }
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
      if(selected !== ''){
        x = selected.split('-')[0];
        y = selected.split('-')[1];
      }
      else return null
    }


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
        <FlatList data={item} renderItem={({item, index}) => rendercell(item, index, group_index)} horizontal={true} style={{
        }}/>
      </View>
    )
  }
  const rendercell = (item, index, group) => {
    let borderBot = 0.2;
    let borderRight = 0.2;
    let borderLeft = 0.2;
    let borderTop = 0.2;
    if(group === 2 || group === 5 || group === 8 ){
      borderBot = 2
    }
    if (index === 2 || index === 5 || index === 8){
      borderRight = 2
    }
    if (index === 0){
      borderLeft = 2
    }
    if (group === 0){
      borderTop = 2
    }

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
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: 'cyan',
                  }}>
                    <Text style={{
                      fontWeight :"bold",
                      fontSize: 23
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
                  borderWidth: 1,
                  borderBottomWidth: borderBot,
                  borderRightWidth : borderRight,
                  borderTopWidth: borderTop,
                  borderLeftWidth: borderLeft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${group}-${index}` === selected ? 'yellow' : 'white',
                }}
                onPress={()=> {
                  setSelected(`${group}-${index}`)
                }}
                disabled={finished === true ? true : false}
      >
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
            borderWidth: 1,
            borderBottomWidth: borderBot,
            borderRightWidth : borderRight,
            borderTopWidth: borderTop,
            borderLeftWidth: borderLeft,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${group}-${index}` === selected ? 'yellow' : 'white',
          }}
                            onPress={()=> {
                              setSelected(`${group}-${index}`)
                            }}
                            disabled={finished === true ? true : false}
          >
            <Text style={{
              fontWeight: "bold",
              fontSize: 23,
              color: checkWrong(group, index)
            }}>
              {item}
            </Text>
          </TouchableOpacity>
        )
    }
  }
  const checkWrong = (group, index) => {
    for (let i = 0 ; i <= wrongNums.length; i++){
      if(`${group}-${index}` === wrongNums[i]){
        return "red"
      }
    }
    return "blue"
  }
  const setRightCell = (listRight, listWrong) => {
    let filled = filledNum
    let index = listWrong.indexOf(`${x}-${y}`)
    let indexRight = listRight.indexOf(`${x}-${y}`)
    if(indexRight == -1){
      listRight.push(`${x}-${y}`)
      filled += 1
      setFilledNum(filled)
      setRightNums(listRight)
      // console.log(listRight);
      console.log(filled);
    }
    if (index > -1) {
      listWrong.splice(index, 1)
      console.log(listWrong);
    }
    SetWrongNum(listWrong)
    console.log(listWrong);
    console.log(listRight);
  }

  const renderNumbersPad = ({item}) => {
    let listWrong = []
    let listRight = []
    listWrong = wrongNums
    listRight = rightNums
    return (
      <TouchableOpacity
        style={{
          width: WIDTH * 0.9 / 11,
          height: WIDTH * 0.9 / 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 14,
          marginHorizontal: 2,
          // elevation: 20,
        }}
        onPress={() => {

          let draft_clone = arrayClone(board_draft)
          getXY()
          if(x != '' && y != ''){
            draft_clone[x][y] = item;
            setBoardDraft(draft_clone);
            if(draft_clone[x][y] != board_resolved[x][y]){
              setLives(lives - 1)
              let index = listWrong.indexOf(`${x}-${y}`)
              console.log(index);
              if (index == -1){
                listWrong.push(`${x}-${y}`)
                SetWrongNum(listWrong)
                // console.log(listWrong);
              }
              console.log(listWrong);
              console.log(listRight);
            }
            else {
              setRightCell(listRight, listWrong)
            }
          }
          else {
            console.log("not selected cell");
          }

        }}
      >
        <Text style={{
          fontSize:23,
          fontWeight: "bold",
          color: "blue"
        }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

    return (
        <SafeAreaView>
          <View style={{
            width: "100%",
            padding: 22,
            flexDirection:"row",
            // alignItems: "center"
          }}>
            <Text style={{
              // backgroundColor: "blue",
              width: WIDTH * 0.9 / 3,
              textAlign:"center"
            }}>
              Level: {level}
            </Text>
            <Text style={{
              // backgroundColor: "black",
              width: WIDTH * 0.9 / 3,
              textAlign:"center"
            }}>
              Lives: {lives}/3
            </Text>
            <Text style={{
              // backgroundColor: "red",
              width: WIDTH * 0.9 / 3,
              textAlign:"center"
            }}>Time: {formatTime(seconds)}</Text>
          </View>
          <View style={{
            // width: WIDTH,
            alignItems: 'center',
          }}>
              <FlatList data={board_draft} renderItem={renderItem} keyExtractor={(item, index) => index + "id" }
              />
          </View>
          <View style={{
            width: WIDTH,
            alignItems: 'center',
            marginVertical: 20
          }}>
            <FlatList
              data={numbers_pad}
              renderItem={renderNumbersPad}
              ItemSeparatorComponent={() => {return (<View style={{width: WIDTH * 0.01}}/>)}}
              horizontal={true}
            />
          </View>
          <View style={{
            width: "100%",
            padding: 22,
            flexDirection:"row",
          }}>
            <TouchableOpacity style={{
              width: WIDTH * 0.9 / 9,

              alignItems: "center",
              marginRight: WIDTH * 0.9 / 3
            }}>
              <Image source={require('../icon/icons8-idea-64.png')}
                     style={{
                       width: 32,
                       height: 32,

                     }}/>
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: WIDTH * 0.9 / 9,

              alignItems: "center",
              marginRight: WIDTH * 0.9 / 3
            }}>
              <Image source={require('../icon/icons8-idea-64.png')}
                     style={{
                       width: 32,
                       height: 32,

                     }}/>
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: WIDTH * 0.9 / 9,
              alignItems: "center",
              // backgroundColor: "red"
            }}
            onPress={()=>{
              let draft_clone = arrayClone(board_draft)
              getXY()
              if(x != '' && y != ''){
                let listWrong
                let listRight
                listWrong = wrongNums
                listRight = rightNums
                draft_clone[x][y] = board_resolved[x][y];
                setBoardDraft(draft_clone);
                setRightCell(listRight, listWrong)
                setHintNum(hintNum - 1)
              }
            }}
                              disabled={hintNum === 0}>
              <ImageBackground source={require('../icon/icons8-idea-64.png')}
                     style={{
                       width: 32,
                       height: 32,
                       flex : 1,
                       // backgroundColor: "blue",
                     }}>
                <View style={{
                  width: 32,
                  height: 32,
                  // backgroundColor: "yellow"
                }}>
                  <Text style={{
                    position: "absolute",
                    top: -7,
                    right: -4,
                    color: "blue",
                    // backgroundColor: "blue"
                  }}>{hintNum}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
    );

}
