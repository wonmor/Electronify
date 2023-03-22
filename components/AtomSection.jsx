import { View, Text, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import PeriodicTable from "./PeriodicTable";

const AtomSection = (props) => {
  return (
    <ScrollView>
      <View style={styles.borderlessContainerAlternative}>
        <PeriodicTable navigation={props.navigation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    marginBottom: 30,
    zIndex: -1,
  },

  container: {
    margin: 20,
    padding: 15,
    backgroundColor: "rgba(79, 97, 125, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },

  icon: {
    width: 100,
    height: 100,
    margin: 5,
  },

  circle: {
    position: "absolute",
    backgroundColor: "rgba(28, 46, 74, 0.5)",
    borderRadius: 50,
  },

  borderlessContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "rgba(28, 46, 74, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1c2e4a",
  },

  borderlessContainerAlternative: {
    margin: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1c2e4a",
    backgroundColor: "rgba(28, 46, 74, 0.4)",
  },

  arrowContainer: {
    margin: 10,
    bottom: 0,
    alignSelf: "center",
  },

  scrollTextContainer: {
    bottom: 0,
    alignSelf: "center",
  },

  appGenericText: {
    textAlign: "center",
    color: "white",
    margin: 5,
  },

  appButtonContainer: {
    width: 200,
    alignSelf: "center",
    marginTop: 10,
    elevation: 8,
    backgroundColor: "#1c2e4a",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },

  appButtonTextHeader: {
    fontSize: 30,
    color: "#bae6fd",
    alignSelf: "center",
  },
});

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  getElementData: (item, type) => dispatch(getElementData(item, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AtomSection);
