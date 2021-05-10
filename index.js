import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Easing, Image, Dimensions } from 'react-native';


const TOTAL_WIDTH = Dimensions.get('window').width;
const ICON_WIDTH = 45;
export default PositionBar = (props) => {
    const [scores] = useState([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ])
    const [glow, setGlow] = useState(
        [
            { opacity: new Animated.Value(0) },
            { opacity: new Animated.Value(0) },
            { opacity: new Animated.Value(0) },
            { opacity: new Animated.Value(0) },
        ]
    )
    getSortedPlayers = (players) => {
        let sortedValues = [...players];
        sortedValues.sort((a, b) => {
            if (a.score < b.score) return -1
            return a.score > b.score ? 1 : 0
        })
        return sortedValues;
    }

    getSortedIndex = (players, unSortedId) => {
        let returnIndex = 0
        players.map((player, index) => {
            if (player.uuid == unSortedId) {
                returnIndex = index;
            }
        })
        return returnIndex;
    }

    useEffect(() => {
        let totalPlayers = props.players.length;
        let sortedPlayers = getSortedPlayers(props.players);
        let array = props.players.map((player, index) => {
            let partWidth = (TOTAL_WIDTH / totalPlayers)
                * (getSortedIndex(sortedPlayers, player.uuid) + 1)
                - TOTAL_WIDTH / (totalPlayers * 2) - ICON_WIDTH / 2
            if (player.uuid == props.scoreUpdateId) {
                Animated.sequence([
                    animate(glow[index].opacity, 1, 0, 0),
                    animate(glow[index].opacity, 0, 500, 100)
                ]).start()
            }
            return animate(scores[index], partWidth);
        })
        Animated.parallel(array).start();


    }, [props.updateProgress, props.scoreUpdateId]
    )

    animate = (key, toValue, duration = 500, delay = 0, callback) => {
        return Animated.timing(key, {
            toValue,
            duration,
            useNativeDriver: false,
            delay: delay,
            easing: Easing.linear
        });
    }
    let padding = (TOTAL_WIDTH / props.players.length)
        - TOTAL_WIDTH / (props.players.length * 2) - ICON_WIDTH / 2

    let glowGreen = require('./ic_multiplayer_glow_green.png');
    let glowRed = require('./ic_multiplayer_glow_red.png');
    return (
        <View
            style={{
                alignSelf: 'center',
                height: ICON_WIDTH,
                width: TOTAL_WIDTH,
                justifyContent: 'center',
            }}
        >
            <Text
                ellipsizeMode={'clip'}
                numberOfLines={1}
                style={[Styles.textTrack, {
                    paddingStart: padding,
                    paddingEnd: padding + 10
                }]}>-----------------------------------------------------------------------</Text>
            {props.players.map((player, index) => {
                let backgroundColor = player.border_color;
                return (
                    <Animated.View
                        key={index + ""}
                        style={[Styles.playerWrapper,
                        {
                            transform: [
                                {
                                    translateX: scores[index]
                                }
                            ]
                        }
                        ]}
                    ><View
                        style={Styles.playerCircle}>
                            <Animated.Image
                                style={{
                                    opacity: glow[index].opacity,
                                    position: 'absolute',
                                    height: 70,
                                    width: 70
                                }}
                                source={player.lastAnswer ? glowGreen : glowRed}
                            />

                            <Image
                                style={{
                                    height: ICON_WIDTH,
                                    width: ICON_WIDTH,
                                    borderRadius: ICON_WIDTH / 2,
                                    borderColor: backgroundColor,
                                    borderWidth: (index == 0 ? 4 : 2)
                                }}
                                source={{ uri: player.profile_picture }}
                            />
                        </View>

                        <Text style={Styles.score}>{player.score}</Text>
                    </Animated.View>
                )

            })}
            {/* 
            <Image
                style={{
                    height: 21,
                    width: 17,
                    position: 'absolute',
                    right: padding,
                    top: -8,
                }}
                source={require('_images/ic_multiplayer_first.png')}
            /> */}
        </View>
    )
}

const Styles = StyleSheet.create({
    playerWrapper: {
        marginVertical: 1,
        top: 0,
        position: 'absolute',
        width: ICON_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',

    },
    playerCircle: {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
        borderRadius: ICON_WIDTH / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textTrack: {
        letterSpacing: 5,
        textAlign: 'center',
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 10
    },
    score: {
        marginTop: 4,
        fontSize: 12,
        color: '#fff',
    }
})
