import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { UserSession } from "../Functions/UtilityFunctions";
import { AutoNumAll } from "../API/AutoNum";
import { GetListCategory } from "../API/GetListData";
import {
  InsertBirthStone,
  InsertBirthStoneColor,
  InsertBrand,
  InsertColors,
  InsertDiamondShape,
  InsertItems,
  InsertKarat,
  InsertMade,
  InsertModel,
  InsertTitus,
  InsertCondition
} from "../API/Insert";
import { Notification } from "../Alert/Notif";
import { UpdateBirthStone, UpdateBirthStoneColor, UpdateBrand, UpdateColor, UpdateDiamond, UpdateItem, UpdateKarat, UpdateMade, UpdateModel, UpdateTitus } from "../API/Update";
export default function CentralizeModal(props) {
  // Well handle the constant
  const [loading, setLoading] = useState(false);
  const [getNum, setNum] = useState("");
  const [getStrCode, setStrCode] = useState("");
  const [getCateg, setCateg] = useState([]);
  const [getstrtblName, setstrtblName] = useState("");
  
  const { CNCode } = UserSession();

  const cnCode = CNCode;

  const [getValid, setValid] = useState(false);
  const [getValidSub, setValidSub] = useState(false);
  const success = { icon: "success", title: "Successfully Saved!" };
  const [btn, setbtn] = useState('')
  //onload for title Modal
  useEffect(() => {

    //console.log("props: ", props);
    //console.log("Title prop received:", props.title);
    const timer = setTimeout(() => {

      if (props.title === "Color Add") {
        AutoNum();
        setbtn('add')
        setAllData(InitializeColor);
      } else if (props.title === "Color Update") {
        setAllData({
          ...InitializeColor,
          ColorCode: props.update.colorCode || "",
          ColorDesc: props.update.colorDesc || "",
          ColorDescSub: props.update.colorDescSub || ""
        });
        setbtn('update')
      } else if (props.title === "Item Add") {
        setAllData(InitializeItem);
        AutoNum();
        setbtn('add')
      } else if (props.title === "Item Update") {
        setAllData({
          ...InitializeItem,
          ItemCode: props.update.itemCode || "",
          ItemDesc: props.update.itemDesc || "",
          CatCode: props.update.catCode || "",
          ItemDescSub: props.update.itemDescSub || ""
        });
        setbtn('update')
      } else if (props.title === "Diamond Shape - Add") {
        setAllData(InitializeDiamondShape);
        AutoNum();
        setbtn('add')
      } else if (props.title === "Diamond Shape - Update") {
        setAllData({
          ...InitializeDiamondShape,
          DiamondShapeCode: props.update.diamondShapeCode || "",
          DiamondShapeDesc: props.update.diamondShapeDesc || "",
          DiaShapeDescSub: props.update.diaShapeDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Birth Stone - Add") {
        setAllData(InitializeBirthStone);
        AutoNum(); setbtn('add')
      } else if (props.title === "Birth Stone - Update") {
        setAllData({
          ...InitializeBirthStone,
          BirthStoneCode: props.update.birthStoneCode || "",
          BirthStoneDesc: props.update.birthStoneDesc || "",
          BSDescSub: props.update.bsDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Birth Stone Color - Add") {
        setAllData(InitializeBirthStoneColor);
        AutoNum(); setbtn('add')
      } else if (props.title === "Birth Stone Color - Update") {
        setAllData({
          ...InitializeBirthStoneColor,
          BSColorCode: props.update.bsColorCode || "",
          BSColorDesc: props.update.bsColorDesc || "",
          BSColorDescSub: props.update.bsColorDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Made - Add") {
        setAllData(InitializeMade);
        AutoNum(); setbtn('add')
      } else if (props.title === "Made - Update") {
        setAllData({
          ...InitializeMade,
          MadeCode: props.update.madeCode || "",
          MadeDesc: props.update.madeDesc || "",
          MadeDescSub: props.update.madeDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Karat - Add") {
        setAllData(InitializeKarat);
        AutoNum(); setbtn('add')
      } else if (props.title === "Karat - Update") {
        setAllData({
          ...InitializeKarat,
          KaratCode: props.update.karatCode || "",
          KaratDesc: props.update.karatDesc || "",
          KaratDescSub: props.update.karatDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Brand - Add") {
        setAllData(InitializeBrand);
        AutoNum(); setbtn('add')
      } else if (props.title === "Brand - Update") {
        setAllData({
          ...InitializeBrand,
          BrandCode: props.update.brandCode || "",
          BrandDesc: props.update.brandDesc || "",
          BrandDescSub: props.update.brandDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Model - Add") {
        setAllData(InitializeModel);
        AutoNum(); setbtn('add')
      } else if (props.title === "Model - Update") {
        setAllData({
          ...InitializeModel,
          ModelCode: props.update.modelCode || "",
          ModelDesc: props.update.modelDesc || "",
          ModelDescSub: props.update.modelDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Titus - Add") {
        setAllData(InitializeTitus);
        AutoNum(); setbtn('add')
      } else if (props.title === "Titus - Update") {
        setAllData({
          ...InitializeTitus,
          TitusCode: props.update.titusCode || "",
          TitusDesc: props.update.titusDesc || "",
          TitusDescSub: props.update.titusDescSub || ""
        }); setbtn('update')
      } else if (props.title === "Condition - Add") {
        setAllData(InitializeCondition);
        AutoNum(); setbtn('add')
      } else if (props.title === "Condition - Update") {
        setAllData({
          ...InitializeCondition,
          ConditionCode: props.update.conditionCode || "",
          ConditionDesc: props.update.conditionDesc || "",
          ConditionDescSub: props.update.conditionDescSub || ""
        }); setbtn('update')
      }



    }, 500);

    return () => clearTimeout(timer);
  }, [props]);


  //Initialize the value for item entry
  const InitializeItem = {
    CNCode: UserSession().CNCode,
    ItemCode: "",
    ItemDesc: "",
    CatCode: "",
    ItemDescSub: "NA"
  };
  //Initialize the value for color entry
  const InitializeColor = {
    CNCode: UserSession().CNCode,
    ColorCode: "",
    ColorDesc: "",
    CatCode: "",
    ColorDescSub: "NA"
  };
  //const Inialize Diamond Shape
  const InitializeDiamondShape = {
    CNCode: UserSession().CNCode,
    DiamondShapeCode: "",
    DiamondShapeDesc: "",
    CatCode: "000",
    DiaShapeDescSub: "NA",
  };
  //for birthStonePage
  const InitializeBirthStone = {
    CNCode: UserSession().CNCode,
    BirthStoneCode: "",
    BirthStoneDesc: "",
    CatCode: "000",
    BSDescSub: "NA"
  };
  const InitializeBirthStoneColor = {
    CNCode: UserSession().CNCode,
    BSColorCode: "",
    BSColorDesc: "",
    BSColorDescSub: "NA"
  };
  const InitializeMade = {
    CNCode: UserSession().CNCode,
    MadeCode: "",
    MadeDesc: "",
    MadeDescSub: "NA"
  };

  /*--------------- RORIDGO ---------------*/
  const InitializeCondition = {
    CNCode: UserSession().CNCode,
    ConditionCode: "",
    ConditionDesc: "",
    CatCode: "000",
    ConditionDescSub: "NA"
  };
  /*--------------- RORIDGO ---------------*/


  const InitializeKarat = {
    CNCode: UserSession().CNCode,
    KaratCode: "",
    KaratDesc: "",
    KaratDescSub: "NA"
  };
  const InitializeBrand = {
    CNCode: UserSession().CNCode,
    BrandCode: "",
    BrandDesc: "",
    BrandDescSub: "NA"
  };

  const InitializeModel = {
    CNCode: UserSession().CNCode,
    ModelCode: "",
    ModelDesc: "",
    ModelDescSub: "NA"
  };
  const InitializeTitus = {
    CNCode: UserSession().CNCode,
    TitusCode: "",
    TitusDesc: "",
    TitusDescSub: "NA"
  };
  const codeMap = {
    "Color Add": "ColorCode",
    "Color Update": "ColorCode",
    "Item Add": "ItemCode",
    "Item Update": "ItemCode",
    "Diamond Shape - Add": "DiamondShapeCode",
    "Diamond Shape - Update": "DiamondShapeCode",
    "Birth Stone - Add": "BirthStoneCode",
    "Birth Stone - Update": "BirthStoneCode",
    "Birth Stone Color - Add": "BSColorCode",
    "Birth Stone Color - Update": "BSColorCode",
    "Made - Add": "MadeCode",
    "Made - Update": "MadeCode",
    "Karat - Add": "KaratCode",
    "Karat - Update": "KaratCode",
    "Brand - Add": "BrandCode",
    "Brand - Update": "BrandCode",
    "Model - Add": "ModelCode",
    "Model - Update": "ModelCode",
    "Titus - Add": "TitusCode",
    "Titus - Update": "TitusCode",

    "Condition - Add": "ConditionCode",
    "Condition - Update": "ConditionCode"

  };

  const descMap = {
    "Color Add": "ColorDesc",
    "Color Update": "ColorDesc",
    "Item Add": "ItemDesc",
    "Item Update": "ItemDesc",
    "Diamond Shape - Add": "DiamondShapeDesc",
    "Diamond Shape - Update": "DiamondShapeDesc",
    "Birth Stone - Add": "BirthStoneDesc",
    "Birth Stone - Update": "BirthStoneDesc",
    "Birth Stone Color - Add": "BSColorDesc",
    "Birth Stone Color - Update": "BSColorDesc",
    "Made - Add": "MadeDesc",
    "Made - Update": "MadeDesc",
    "Karat - Add": "KaratDesc",
    "Karat - Update": "KaratDesc",
    "Brand - Add": "BrandDesc",
    "Brand - Update": "BrandDesc",
    "Model - Add": "ModelDesc",
    "Model - Update": "ModelDesc",
    "Titus - Add": "TitusDesc",
    "Titus - Update": "TitusDesc",

    "Condition - Add": "ConditionDesc",
    "Condition - Update": "ConditionDesc"

  };

  const descSubMap = {
    "Color Add": "ColorDescSub",
    "Color Update": "ColorDescSub",
    "Item Add": "ItemDescSub",
    "Item Update": "ItemDescSub",
    "Diamond Shape - Add": "DiaShapeDescSub",
    "Diamond Shape - Update": "DiaShapeDescSub",
    "Birth Stone - Add": "BSDescSub",
    "Birth Stone - Update": "BSDescSub",
    "Birth Stone Color - Add": "BSColorDescSub",
    "Birth Stone Color - Update": "BSColorDescSub",
    "Made - Add": "MadeDescSub",
    "Made - Update": "MadeDescSub",
    "Karat - Add": "KaratDescSub",
    "Karat - Update": "KaratDescSub",
    "Brand - Add": "BrandDescSub",
    "Brand - Update": "BrandDescSub",
    "Model - Add": "ModelDescSub",
    "Model - Update": "ModelDescSub",
    "Titus - Add": "TitusDescSub",
    "Titus - Update": "TitusDescSub",

    "Condition - Add": "ConditionDescSub",
    "Condition - Update": "ConditionDescSub"

  };

  const titleMap = {
    "Color Add": "Color",
    "Item Add": "Item",
    "Diamond Shape - Add": "Diamond Shape",
    "Birth Stone - Add": "Birth Stone",
    "Birth Stone Color - Add": "Birth Stone Color",
    "Made - Add": "Made",
    "Karat - Add": "Karat",
    "Brand - Add": "Brand",
    "Model - Add": "Model",
    "Titus - Add": "Titus",

    "Condition - Add": "Condition"
  };
  //onLoad for Title Page
  useEffect(() => {
    //console.log("PageName prop received:", props.PageName);
    const timer = setTimeout(() => {
      if (props.PageName === "Color") {
        setAllData(InitializeColor);
        setStrCode("ColorCode");
        setstrtblName("tblEntryColor");
      } else if (props.PageName === "items") {
        Category();
        setAllData(InitializeItem);
        setStrCode("ItemCode");
        setstrtblName("tblEntryItem");
        // console.log(props.PageName)
        // console.log(props.title)

      } else if (props.PageName === "DiamondShape") {
        setAllData(InitializeDiamondShape);
        setStrCode("DiamondShapeCode");
        setstrtblName("tblEntryDiamondShape");
      } else if (props.PageName === "BirthStone") {
        setAllData(InitializeBirthStone);
        setStrCode("BirthStoneCode");
        setstrtblName("tblEntryBirthStone");
      } else if (props.PageName === "BirthStoneColor") {
        setAllData(InitializeBirthStoneColor);
        setStrCode("BSColorCode");
        setstrtblName("tblEntryBSColor");
      } else if (props.PageName === "Made") {
        setAllData(InitializeMade);
        setStrCode("MadeCode");
        setstrtblName("tblEntryMade");
      } else if (props.PageName === "Karat") {
        setAllData(InitializeKarat);
        setStrCode("KaratCode");
        setstrtblName("tblEntryKarat");
      } else if (props.PageName === "Brand") {
        setAllData(InitializeBrand);
        setStrCode("BrandCode");
        setstrtblName("tblEntryBrand");
      } else if (props.PageName === "Model") {
        setAllData(InitializeModel);
        setStrCode("ModelCode");
        setstrtblName("tblEntryModel");
      } else if (props.PageName === "Titus") {
        setAllData(InitializeTitus);
        setStrCode("TitusCode");
        setstrtblName("tblEntryTitus");
      } 

        else if (props.PageName === "Condition") {
        setAllData(InitializeCondition);
        setStrCode("ConditionCode");
        setstrtblName("tblEntryCondition");
      }

    }, 500);

    return () => clearTimeout(timer);
  }, [props.PageName]);


  useEffect(() => {

    AutoNum();
  
  }, [getStrCode, getstrtblName]);


  const [getAllData, setAllData] = useState([]);

  const name = codeMap[props.title] || "";
  const value = name ? getAllData[name] : "";
  const descName = descMap[props.title] || "";
  const descValue = descName ? getAllData[descName] : "";
  const subDescName = descSubMap[props.title] || "";
  const subDescValue = subDescName ? getAllData[subDescName] : "";
  // const title = titleMap[props.title] || "";

  const HandleAllData = (e) => {
    const { name, value, type } = e.target;
    setAllData({
      ...getAllData,
      [name]: value
    });
    setValid(false);
    setValidSub(false);
  };


  const HandleAdd = async () => {
    if (descValue.trim() === "") {
      setValid(true);
    } else if (subDescValue.trim() === "") {
      setValidSub(true);
    } else {
      if (props.PageName === "Titus") {
        const res = await InsertTitus(getAllData);
        if (res === "Inserted") {
          setAllData(InitializeTitus);
          Clear();
        }
      }
      if (props.PageName === "Model") {
        setLoading(true)
        const res = await InsertModel(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeModel);
          Clear();
        }
      }
      if (props.PageName === "Brand") {
        setLoading(true)
        const res = await InsertBrand(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeBrand);
          Clear();
        }
      }
      if (props.PageName === "Karat") {
        setLoading(true)
        const res = await InsertKarat(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeKarat);
          Clear();
        }
      }
      if (props.PageName === "Made") {
        setLoading(true)
        const res = await InsertMade(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeMade);
          Clear();
        }
      } if (props.PageName === "BirthStoneColor") {
        
        setLoading(true)
        const res = await InsertBirthStoneColor(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeBirthStoneColor);
          Clear();
        }
      }
      if (props.PageName === "BirthStone") {
        setLoading(true)
        const res = await InsertBirthStone(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeBirthStone);
          Clear();
        }
      }
      if (props.PageName === "DiamondShape") {
        setLoading(true)
        //console.log(getAllData)
        const res = await InsertDiamondShape(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeDiamondShape);
          Clear();
        }
      }
      if (props.PageName === "items") {
        //setLoading(true)
        console.log(getAllData)

        const res = await InsertItems(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeItem);
          Clear();
        }
      }
      if (props.PageName === "Color") {
        setLoading(true)
        const res = await InsertColors(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeColor);
          Clear();
        }
      }
      if (props.PageName === "Condition") {
        setLoading(true)
        //console.log(getAllData)
        const res = await InsertCondition(getAllData)
        if (res === "Inserted") {
          setAllData(InitializeCondition);
          Clear();
        }
      }

    }
  };

  const HandleUpdate = async () => {
    // console.log(getAllData)
    if (descValue.trim() === "") {
      setValid(true);
    } else if (subDescValue.trim() === "") {
      setValidSub(true);
    } else {
      // setLoading(true);
      if (props.PageName === "Color") {
        const res = await UpdateColor(getAllData);
        if (res === "Updated") {
          setAllData(InitializeColor);
          Clear();
        }
      }

      if (props.PageName === "items") {
        const res = await UpdateItem(getAllData);
        if (res === "Updated") {
          setAllData(InitializeItem);
          Clear();
        }
      }
      if (props.PageName === "DiamondShape") {
        const res = await UpdateDiamond(getAllData);
        if (res === "Updated") {
          setAllData(InitializeDiamondShape);
          Clear();
        }
      }
      if (props.PageName === "BirthStone") {
        const res = await UpdateBirthStone(getAllData);
        if (res === "Updated") {
          setAllData(InitializeBirthStone);
          Clear();
        }
      }
      if (props.PageName === "BirthStoneColor") {
        const res = await UpdateBirthStoneColor(getAllData);
        if (res === "Updated") {
          setAllData(InitializeBirthStoneColor);
          Clear();
        }
      }
      if (props.PageName === "Made") {
        const res = await UpdateMade(getAllData);
        if (res === "Updated") {
          setAllData(InitializeMade);
          Clear();
        }
      }
      if (props.PageName === "Karat") {
        const res = await UpdateKarat(getAllData);
        if (res === "Updated") {
          setAllData(InitializeKarat);
          Clear();
        }
      }
      if (props.PageName === "Brand") {
        const res = await UpdateBrand(getAllData);
        if (res === "Updated") {
          setAllData(InitializeBrand);
          Clear();
        }
      }
      if (props.PageName === "Model") {
        const res = await UpdateModel(getAllData);
        if (res === "Updated") {
          setAllData(InitializeModel);
          Clear();
        }
      } if (props.PageName === "Titus") {
        const res = await UpdateTitus(getAllData);
        if (res === "Updated") {
          setAllData(InitializeTitus);
          Clear();
        }
      }
    }
  };

  const Clear = () => {
    Notification(success);
    props.success();
    AutoNum();
    props.handleClose();
    setValid(false);
    setValidSub(false);
    setLoading(false);
  };



  const AutoNum = async () => {
    let result = "";

    try {
      // console.log(cnCode, getStrCode, getstrtblName)
      //console.log(cnCode, getStrCode, getstrtblName)

      result = await AutoNumAll(cnCode, getStrCode, getstrtblName);
      //result = await AutoNumAllNoCnCode(getStrCode, getstrtblName);
      //console.log(result)

      if (props.title === "Color Add") {
        setAllData({
          ...InitializeColor,
          ColorCode: `${result}`
        });
      } else if (props.title === "Item Add") {
        setAllData({
          ...InitializeItem,
          ItemCode: `${result}`
        });
      } else if (props.title === "Diamond Shape - Add") {
        setAllData({
          ...InitializeDiamondShape,
          DiamondShapeCode: `${result}`
        });
      } else if (props.title === "Birth Stone - Add") {
        setAllData({
          ...InitializeBirthStone,
          BirthStoneCode: `${result}`
        });
      } else if (props.title === "Birth Stone Color - Add") {
        setAllData({
          ...InitializeBirthStoneColor,
          BSColorCode: result
        });
      } else if (props.title === "Made - Add") {
        setAllData({
          ...InitializeMade,
          MadeCode: `${result}`
        });
      } else if (props.title === "Karat - Add") {
        setAllData({
          ...InitializeKarat,
          KaratCode: `${result}`
        });
      } else if (props.title === "Brand - Add") {
        setAllData({
          ...InitializeBrand,
          BrandCode: result
        });
      } else if (props.title === "Model - Add") {
        setAllData({
          ...InitializeModel,
          ModelCode: result
        });
      } else if (props.title === "Titus - Add") {
        setAllData({
          ...InitializeTitus,
          TitusCode: result
        });
      }

      else if (props.title === "Condition - Add") {
        setAllData({
          ...InitializeCondition,
          ConditionCode: `${result}`
        });
      }


    } catch (error) {
      console.error(error);
    }
  };

  const Category = async () => {
    try {
      const result = await GetListCategory();
      setCateg(result);
    } catch (error) {
      Notification({ icon: "error", title: "Somethings wen wrong!" });
    }
  };
  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ p: 2, fontSize: "1.1rem" }}>
        {props.title}
      </DialogTitle>
      <DialogContent dividers>
        <div className="d-grid">
          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              className="form-control w-25 text-end"
              name={name}
              value={value}
              onChange={HandleAllData}
              disabled
            />
          </div>
          {props.title === "Item Add" || props.title === "Item Update" ? (
            <div className="d-grid mb-3">
              <span className="align-top">Category:</span>
              <select
                name="CatCode"
                value={getAllData.CatCode}
                onChange={HandleAllData}
                className="form-control text-center align-middle"
              >
                <option value="">-----Please Select-----</option>
                {getCateg.map((item, index) => (
                  <option key={index} value={item.catCode}>
                    {item.catDesc}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ""
          )}
          <div className="d-flex justify-content-center gap-4">
            <div className="d-grid justify-content-center align-content-center">
              <input
                type="text"
                className={`form-control border border-top-0 border-start-0 border-end-0 text-center ${getValid ? "is-invalid" : ""}`}
                name={descName}
                value={descValue}
                onChange={HandleAllData}
              />
              <span className="text-center">
                {props.title === "Color Add" || props.title === "Color Update"
                  ? "Color"
                  : props.title === "Item Add" || props.title === "Item Update"
                  ? "Item"
                  : props.title === "Diamond Shape - Add" || props.title === "Diamond Shape - Update"
                  ? "Diamond Shape"
                  : props.title === "Birth Stone - Add" || props.title === "Birth Stone - Update"
                  ? "Birth Stone"
                  : props.title === "Birth Stone Color - Add" || props.title === "Birth Stone Color - Update"
                  ? "Birth Stone Color"
                  : props.title === "Made - Add" || props.title === "Made - Update"
                  ? "Made"
                  : props.title === "Karat - Add" || props.title === "Karat - Update"
                  ? "Karat"
                  : props.title === "Brand - Add" || props.title === "Brand - Update"
                  ? "Brand"
                  : props.title === "Model - Add" || props.title === "Model - Update"
                  ? "Model"
                  : props.title === "Titus - Add" || props.title === "Titus - Update"
                  ? "Titus"
                  : props.title === "Condition - Add" || props.title === "Condition - Update"
                  ? "Condition"
                  : ""}
              </span>
            </div>

            {/* <div className="d-grid justify-content-center align-content-center">
              <input
                type="text"
                className={`form-control border border-top-0 border-start-0 border-end-0 text-center ${getValidSub ? "is-invalid" : ""}`}
                name={subDescName}
                value={subDescValue}
                onChange={HandleAllData}
              />
              <span className="text-center">Sub Description</span>
            </div>*/}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="outlined" className="bg-sec" onClick={props.handleClose}>
          <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
        </Button>
        <Button
          size="small"
          variant="contained"
          className="bg-prim"
          disabled={loading}
          onClick={() => { btn === "add" ? HandleAdd() : HandleUpdate(); }}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin-pulse"></i>&nbsp;Updating...
            </>
          ) : (
            <>
              <i className="fa-regular fa-floppy-disk"></i>&nbsp;Save
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
