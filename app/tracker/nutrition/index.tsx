import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Nutrition } from "@/types/types";
import { NutritionService } from "@/storage/NutritionService";
import useThemedStyles from "@/components/hooks/useThemedStyles";
import i18n from "@/components/mycomponents/setup/localization/localization";
import MenuContainer from "@/components/mycomponents/setup/editdeletebtns";
import QuickLogButton from "@/components/mycomponents/setup/QuickLogButton";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import BackButton from "@/components/mycomponents/setup/BackButton";

const NutritionEntriesScreen: React.FC = () => {
  // State management
  const [nutritionItems, setNutritionItems] = useState<Nutrition[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Nutrition | null>(null);
  const styles = useThemedStyles(); // ✅ Automatically gets updated styles
  const navigation = useNavigation();
  const [openType, setOpenType] = useState(false);
  const [openServing, setOpenServing] = useState(false);

  const [itemsServing, setItemsServing] = useState([
    { label: i18n.t("NUTRITION.SERVING_UNITS.PIECE"), value: "piece" },
    { label: i18n.t("NUTRITION.SERVING_UNITS.GRAMS"), value: "g" },
    { label: i18n.t("NUTRITION.SERVING_UNITS.MILLILITERS"), value: "ml" },
    { label: i18n.t("NUTRITION.SERVING_UNITS.OUNCES"), value: "oz" }
  ]);

  const [itemsType, setItemsType] = useState([
    { label: i18n.t("NUTRITION.MEAL_TYPES.MEAL"), value: "Meal" },
    { label: i18n.t("NUTRITION.MEAL_TYPES.SNACK"), value: "Snack" },
    { label: i18n.t("NUTRITION.MEAL_TYPES.DRINK"), value: "Drink" },
  ]);


  // Form state
  const [newNutrition, setNewNutrition] = useState<Partial<Nutrition>>({
    id: Date.now().toString(),
    name: "",
    type: "Meal",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: 1,
    servingUnit: "g",
    notes: "",
    favorite: false,
    consumedAt: new Date(),
  });

  // Load data on mount
  useEffect(() => {
    loadNutritionItems();
  }, []);

  const loadNutritionItems = async () => {
    const results = await NutritionService.getAllNutrition();
    setNutritionItems(results);
  };

  // CRUD Operations
  const handleAddNutrition = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const nutrition: Nutrition = {
      ...newNutrition as Nutrition,
      id: Date.now().toString(),
      lastUsed: new Date(),
    };

    const success = await NutritionService.createNutrition(nutrition);
    if (success) {
      loadNutritionItems();
      setModalVisible(false);
    }
  };

  const handleUpdateNutrition = async () => {
    if (!selectedItem || !validateForm(true)) return;

    const success = await NutritionService.updateNutrition(selectedItem.id, selectedItem);
    if (success) {
      loadNutritionItems();
      setModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleDeleteNutrition = async (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this nutrition item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await NutritionService.deleteNutrition(id);
            if (success) {
              loadNutritionItems();
            }
            setMenuVisible(null);
          }
        }
      ]
    );
  };


  const handleReenterWithNewTime = async (nutrition: Nutrition) => {
    const newEntry = {
      ...nutrition,
      id: Date.now().toString(), // Generate a new ID for the entry
      lastUsed: new Date(), // Update lastUsed timestamp
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const success = await NutritionService.createNutrition(newEntry);
    if (success) {
      loadNutritionItems();
    }
  };

  const handleToggleFavorite = async (item: Nutrition) => {
    const success = await NutritionService.updateNutrition(
      item.id,
      { ...item, favorite: !item.favorite }
    );
    if (success) {
      loadNutritionItems();
    }
  };

  // Validation
  const validateForm = (isEdit: boolean = false) => {
    const item = isEdit ? selectedItem : newNutrition;

    if (!item) return false;

    // Check if required string fields exist and are not empty
    if (!item.name?.trim() || !item.type) return false;

    // Check if type is valid
    if (!['Meal', 'Snack', 'Drink'].includes(item.type)) return false;

    // Check if numeric values are valid numbers and within range
    const calories = Number(item.calories);
    const protein = Number(item.protein);
    const carbs = Number(item.carbs);
    const fat = Number(item.fat);
    const servingSize = Number(item.servingSize);

    if (
      isNaN(calories) ||
      isNaN(protein) ||
      isNaN(carbs) ||
      isNaN(fat) ||
      isNaN(servingSize)
    ) {
      return false;
    }

    // Validate numeric ranges
    if (
      calories < 0 ||
      protein < 0 ||
      carbs < 0 ||
      fat < 0 ||
      servingSize <= 0
    ) {
      return false;
    }

    // Check if serving unit is valid
    if (!item.servingUnit || !['g', 'ml', 'oz', 'piece'].includes(item.servingUnit)) {
      return false;
    }

    return true;
  };


  // Render item in the list
  const renderNutritionItem = ({ item }: { item: Nutrition }) => (
    <View style={styles.card}>
      <View style={styles.buttonContainer}>
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleToggleFavorite(item)}
        >
          <Text style={styles.title}>{item.favorite ? "★" : "☆"}</Text>
        </TouchableOpacity>

        {/* Name and Type */}
        <Text style={styles.title}>{item.name}</Text>

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(isMenuVisible === item.id ? null : item.id)}
        >
          <Text style={styles.title}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Nutrition Details */}
      <Text style={styles.menuText}>{i18n.t("LABELS.TYPE")}:{item.type}</Text>
      <Text style={styles.menuText}>{i18n.t("LABELS.CALORIES")}: {item.calories} kcal</Text>
      <Text style={styles.menuText}>
        {i18n.t("LABELS.PROTEIN")}: {item.protein}g | {i18n.t("LABELS.CARBS")}: {item.carbs}g | {i18n.t("LABELS.FAT")}: {item.fat}g
      </Text>
      <Text style={styles.menuText}>
        {i18n.t("LABELS.SERVINGSIZE")}: {item.servingSize} {item.servingUnit}
      </Text>

      {/* Notes */}
      {item.notes && <Text style={styles.text}>{item.notes}</Text>}
      {/* Quick Log Button */}
      <QuickLogButton onReenter={() => handleReenterWithNewTime(item)} />

      {/* Menu Actions */}
      {isMenuVisible === item.id && (
        <>
          {/* Click outside to close */}
          <TouchableOpacity
            style={styles.menuBackdrop}
            onPress={() => setMenuVisible(null)} />

          {/* Menu Container */}
          <MenuContainer
            onEdit={() => {
              setSelectedItem(item);
              setModalVisible(true);
              setMenuVisible(null);
            }}
            onDelete={() => handleDeleteNutrition(item.id)}
            setActiveMenu={setMenuVisible}
          />
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Back Button */}
      <BackButton />
      {/* Header Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSelectedItem(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>{i18n.t('TRACKERS.NUTRITION.ADD')}</Text>

        </TouchableOpacity>
      </View>

      {/* Main Nutrition List */}
      <FlatList
        data={nutritionItems}
        keyExtractor={(item) => item.id}
        renderItem={renderNutritionItem}
        ListEmptyComponent={
          <View style={styles.section}>
            <Text style={styles.text}>{i18n.t('TRACKERS.NUTRITION.NO_DATA')}</Text>
          </View>
        }
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeader}>
                  {selectedItem ? i18n.t('TRACKERS.NUTRITION.EDIT') : i18n.t('TRACKERS.NUTRITION.ADD')}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cardHeader}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Name Input */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t("LABELS.NAME")}</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedItem?.name || newNutrition.name}
                    onChangeText={(text) =>
                      selectedItem
                        ? setSelectedItem({ ...selectedItem, name: text })
                        : setNewNutrition({ ...newNutrition, name: text })
                    }
                  />
                </View>


                <Text style={styles.text}>{i18n.t('LABELS.TYPE')}</Text>
                <View style={{ zIndex: openType ? 3000 : 1, marginBottom: openType ? 150 : 0 }}>
                  <DropDownPicker
                    open={openType}
                    value={selectedItem?.type ?? newNutrition.type ?? "Meal"}
                    items={itemsType}
                    setOpen={setOpenType}
                    setValue={(callback) => {
                      const newValue = typeof callback === "function"
                        ? callback(selectedItem?.type ?? newNutrition.type ?? "Meal")
                        : callback;

                      if (!['Meal', 'Snack', 'Drink'].includes(newValue)) return;

                      if (selectedItem) {
                        setSelectedItem((prev) => prev ? { ...prev, type: newValue } : prev);
                      } else {
                        setNewNutrition((prev) => prev ? { ...prev, type: newValue } : prev);
                      }
                    }}
                    style={{ backgroundColor: "white", minWidth: 120 }}
                    dropDownContainerStyle={{ backgroundColor: "white" }}
                    listMode="SCROLLVIEW"
                  />
                </View>

                <Text style={styles.text}>{i18n.t('LABELS.SERVINGSIZE')}</Text>
                <View style={{ zIndex: openServing ? 3000 : 1, marginBottom: openServing ? 150 : 0 }}>
                  <View style={styles.rowContainer}>
                    <TextInput
                      style={[styles.input, { flex: 1, textAlign: "center" }]} 
                      keyboardType="numeric"
                      value={String(selectedItem?.servingSize || newNutrition.servingSize)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, servingSize: value })
                          : setNewNutrition({ ...newNutrition, servingSize: value });
                      }}
                    />

                    <Text style={[styles.text, { marginHorizontal: 8 }]}> / </Text>

                    <View style={{ flex: 2 }}>
                      <DropDownPicker
                        open={openServing}
                        value={selectedItem?.servingUnit ?? newNutrition.servingUnit ?? "piece"}
                        items={itemsServing}
                        setOpen={setOpenServing}
                        setValue={(callback) => {
                          const newValue = typeof callback === "function"
                            ? callback(selectedItem?.servingUnit ?? newNutrition.servingUnit ?? "piece")
                            : callback;

                          if (!['g', 'ml', 'oz', 'piece'].includes(newValue)) return;

                          selectedItem
                            ? setSelectedItem((prev) =>
                              prev ? { ...prev, servingUnit: newValue } : prev
                            )
                            : setNewNutrition((prev) =>
                              prev ? { ...prev, servingUnit: newValue } : prev
                            );
                        }}
                        style={{ backgroundColor: "white", minWidth: 100 }}
                        dropDownContainerStyle={{ backgroundColor: "white" }}
                        listMode="SCROLLVIEW"
                      />
                    </View>
                  </View>

                </View>

                {/* Nutrition Values */}
                <View style={styles.section}>
                  <Text style={styles.text}>
                    {i18n.t("HISTORY.DR_REPORTS.CATEGORIES.NUTRITION")} {i18n.t("LABELS.VALUE")}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(selectedItem?.calories || newNutrition.calories)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, calories: value })
                          : setNewNutrition({ ...newNutrition, calories: value });
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(selectedItem?.protein || newNutrition.protein)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, protein: value })
                          : setNewNutrition({ ...newNutrition, protein: value });
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(selectedItem?.carbs || newNutrition.carbs)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, carbs: value })
                          : setNewNutrition({ ...newNutrition, carbs: value });
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(selectedItem?.fat || newNutrition.fat)}
                      onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, fat: value })
                          : setNewNutrition({ ...newNutrition, fat: value });
                      }}
                    />
                  </View>
                </View>

                {/* Notes Input */}
                <View style={styles.section}>
                  <Text style={styles.text}>{i18n.t("LABELS.NOTES")}</Text>
                  <TextInput
                    style={[styles.input]}
                    value={selectedItem?.notes || newNutrition.notes}
                    onChangeText={(text) =>
                      selectedItem
                        ? setSelectedItem({ ...selectedItem, notes: text })
                        : setNewNutrition({ ...newNutrition, notes: text })
                    }
                    multiline
                  />
                </View>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={selectedItem ? handleUpdateNutrition : handleAddNutrition}
                  >
                    <Text style={styles.buttonText}>{i18n.t("GENERAL_TRACKER.MODAL.SAVE")}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );



};

export default NutritionEntriesScreen;
