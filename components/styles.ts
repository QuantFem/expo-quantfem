import {StyleSheet} from "react-native";

const styles=StyleSheet.create({
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  editButton: {
    backgroundColor: "#4CAF50", // Green for edit
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    padding: 20,
  },
  deleteButton: {
    backgroundColor: "#D32F2F", // Red for delete
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 5,
  },
  notifications: {
    color: '#FFD700', // Gold text for emphasis
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
},

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: "uppercase",
        textAlign: 'center',


  },
  subHeader: {
    fontSize: 18,
    color: 'white',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  abutton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#4A90E2', // Dark blue
  },

  
//create a button that has a blue border around it 
button: {
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
  width: '48%',
  alignItems: 'center',
  backgroundColor: '#f9fcff',
  elevation: 3, // Add shadow for better UI
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  margin: 3,
},


  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: '#4A90E2', // Dark blue
  },
  cancelButton: {
    backgroundColor: '#D32F2F', // Red
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  historyList: {
    flexGrow: 1,
    marginBottom: 14,
  },
  historyCard: {
    backgroundColor: '#f0f8ff', // Dark blue cards
    color: 'black',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  
  nextChangeText: {
    fontSize: 14,
    fontStyle: 'italic', // Makes the text italic
    marginTop: 5,
  },
  

  toggleButton: {
    backgroundColor: '#4A90E2', // Dark blue
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  insightsContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 15, 
    backgroundColor: '#fff',
    alignItems: "flex-start",
    justifyContent: "center",
  },
  Text:{
    fontStyle: "italic",
    fontSize: 14,
    margin: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  
  insightsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  
  notificationItem: {
    fontSize: 16,
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",

  },
  
  icon: {
    fontSize: 18, 
    marginRight: 8, 
  },
  
  
  entryContainer: {
    flexDirection: "column", // ✅ Stack items vertically
    alignItems: "flex-start", // ✅ Align text neatly to the left
    justifyContent: "flex-start",
    width: "100%",
    borderBottomWidth: 1,
    borderRadius: 15,
    borderColor: '#E5E9EC',
    padding: 8, // ✅ Adds space between items
    marginBottom: 8, // ✅ Prevents squeezing
  },
  
  
  nextTimeText: {
    fontSize: 14,
    overflow: "hidden",
  },
  



  historyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyTime: {
    fontSize: 14,
  },
});

export default styles;