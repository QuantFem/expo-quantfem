import {StyleSheet,Platform,Dimensions} from "react-native";
import Colors from "./Colors";

const {width}=Dimensions.get("window");

const SPACING=width*0.03; // Dynamic spacing
const BORDER_RADIUS=10;
const BUTTON_PADDING=8;
const ICON_SIZE=48;

export function getThemedStyles(theme: "light"|"dark"|"blue"|"green"|"purple") {
    return StyleSheet.create({
        /** GENERAL CONTAINERS **/
        
        container: {
            flex: 1,
            backgroundColor: Colors[theme].background,
            padding: SPACING,
        },

        buttonContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },


        rowContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: BUTTON_PADDING,
            backgroundColor: Colors[theme].accentBackground,
            borderRadius: BORDER_RADIUS,
            marginVertical: SPACING/2,
        },

        section: {
            marginVertical: SPACING, // Used for grouping sections
        },

        /** TEXT STYLES **/
        text: {
            fontSize: 16,
            color: Colors[theme].buttonText,
        },

        textSmall: {
            fontSize: 14,
            color: Colors[theme].buttonText,
            opacity: 0.8,
        },
        menuText: {
            fontSize: 18,
            fontWeight: "600",
            color: Colors[theme].buttonText,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: Colors[theme].buttonText,
            marginBottom: SPACING/2,
            textAlign: "center",
        },
        calendarRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        emptyCell: {
            flex: 1,
            aspectRatio: 1,
            backgroundColor: "transparent",
        },


        link: {
            fontSize: 16,
            color: Colors[theme].buttonText,
            fontWeight: "600",
            textDecorationLine: "underline",
        },
        cell: {
            width: `${100/7}%`,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: Colors[theme].background,
            margin: 3,
            ...shadow, // Reusing shadow styles
        },

        eventIndicatorContainer: {
            flexDirection: 'row',
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: [{translateX: -12}],
        },

        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 16,
            alignItems: 'center',
        },

        cardHeader: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: SPACING/2,
            color: Colors[theme].buttonText,
        },


        /** ICON **/
        icon: {
            fontSize: ICON_SIZE,
            marginBottom: 6,
            color: Colors[theme].buttonText,
        },


        /** GRID STYLES **/
        threeCell: {
            width: '31%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors[theme].button,
            borderRadius: BORDER_RADIUS-2,
            marginBottom: '3%',
        },

        /** BUTTONS **/
        button: {
            padding: BUTTON_PADDING,
            borderRadius: BORDER_RADIUS-2,
            alignItems: "center",
            flex: 1, // Ensures flexible width
            width: "45%",
            backgroundColor: Colors[theme].button,
            margin: SPACING/2,
        },
        roundButton: {
            borderRadius: 100,
            opacity: 0.4,
            padding: BUTTON_PADDING,
            alignItems: "center",
            flex: 1, // Ensures flexible width
            backgroundColor: Colors[theme].button,
            margin: 2,
        },



        roundButtonActive: {
            opacity: 1,
        },


        buttonPrimary: {
            backgroundColor: Colors[theme].tint,
        },

        buttonDisabled: {
            opacity: 0.6,
        },
        buttonText: {
            fontSize: 16,
            fontWeight: "bold",
            color: Colors[theme].buttonText,
            textAlign: "center",
        },



        selectedSelectionButton: {
            backgroundColor: Colors[theme].tint, // Unique highlight for selected state
        },

        selectedSelectionButtonText: {
            color: Colors[theme].buttonText, // Ensures readability when selected
        },



        /** MODALS **/
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
        },

        modalContent: {
            width: "85%",
            maxWidth: width>600? 500:400, // Adjusts for tablets
            backgroundColor: Colors[theme].background,
            padding: SPACING*2,
            borderRadius: BORDER_RADIUS,
            alignSelf: "center",
            ...shadow, // Reusing shadow styles
        },

        modalHeader: {
            fontSize: 18,
            fontWeight: "bold",

            textAlign: "center",
            marginBottom: SPACING,
        },

        modalButton: {
            fontSize: 16,
            fontWeight: "bold",
            color: Colors[theme].tint,
            textAlign: "center",
            marginTop: SPACING,
        },

        modalText: {
            fontSize: 14,

            opacity: 0.8,
            textAlign: "center",
            marginBottom: SPACING,
        },

        /** INPUTS **/
        input: {
            borderWidth: 2,
            borderColor: Colors[theme].border,
            borderRadius: BORDER_RADIUS-2,
            paddingVertical: SPACING/2,
            paddingHorizontal: SPACING,
            minHeight: 40,
            backgroundColor: "white",

        },

        inputFocused: {
            borderColor: Colors[theme].tint,
        },

        /** SCROLL CONTAINER **/
        scrollContainer: {
            flexGrow: 1,
            paddingBottom: SPACING,
        },

        /** Menu Items **/

        menuButton: {
            padding: 8,
        },

        menuButtonText: {
            fontSize: 20,
            fontWeight: "bold",

        },

        /** REUSABLE MENU STYLES **/
        menuContainer: {
            position: "absolute",
            right: SPACING,
            top: 40,
            backgroundColor: Colors[theme].background,
            borderRadius: BORDER_RADIUS,
            shadowColor: "rgba(0,0,0,0.2)",
            shadowOffset: {width: 0,height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 3,
            elevation: 4,
            width: 150,
            zIndex: 10,
        },

        menuItem: {
            padding: 6,
            borderBottomWidth: 1,
            borderBottomColor: Colors[theme].accentBackground,

        },



        menuBackdrop: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 5,
        },
        logo: {
            width: width*0.3,
            height: width*0.3,
            marginBottom: 20,
            resizeMode: "contain",
        },
        illustration: {
            marginBottom: 20,
        },
        tooltipContainer: {
            position: "absolute",
            bottom: 100, // ✅ Places it just above the tab bar
            right: 10,  // ✅ Moves the entire tooltip container to the right
            zIndex: 100,
            alignItems: "flex-end", // ✅ Ensures tooltip stays on the right
        },

        tooltip: {
            backgroundColor: "#333",
            padding: 8,
            borderRadius: 6,
            maxWidth: 200,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
        },



        /**Card styles */
        card: {
            backgroundColor: Colors[theme].cardBackground,
            borderRadius: BORDER_RADIUS,
            padding: SPACING*1.5,
            marginVertical: SPACING/2,
            shadowColor: Colors[theme].shadow,
            shadowOffset: {width: 0,height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
        },



    });
}

/** REUSABLE SHADOW STYLES **/
const shadow=Platform.select({
    ios: {
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: {width: 0,height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    android: {
        elevation: 4,
    },
});
