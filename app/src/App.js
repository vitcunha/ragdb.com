import "./styles.css";
import axios from "axios";
import { useEffect, useState } from "react";
import items from "./jsons/item_db_1.json";
import mobs from "./jsons/mob_db_1.json";
import spawn from "./jsons/mob_spawn_1.json";
import default_index_items from "./jsons/index_en_us_items.json";
import default_index_mobs from "./jsons/index_en_us_mobs.json";

const DROP_SLOTS = 8;
const DROP_SLOTS_ARRAY = Array.from(Array(DROP_SLOTS).keys());

const DropEntry = ({
  dropID,
  dropRateMultiplier,
  baseDropRate,
  makeDropClickable,
  itemIndex
}) => {
  const getFormattedDropRate = () => {
    const minDropRate = dropRateMultiplier || 1;
    const formattedDropRate = (baseDropRate * minDropRate) / 100;
    return formattedDropRate > 100 ? 100 : formattedDropRate;
  };

  return (
    <li className="dropEntry" onClick={makeDropClickable(dropID)}>
      <img
        src={`/img/item/${dropID}.png`}
        alt="a"
      />
      {itemIndex[dropID]}: {getFormattedDropRate()}%
    </li>
  );
};

export default function App() {
  const [filteredMobs, setfilteredMobs] = useState([]);
  const [filteredItems, setfilteredItems] = useState([]);
  const [inputBusca, setinputBusca] = useState("");
  const [selectedMob, setselectedMob] = useState(null);
  const [selectedItem, setselectedItem] = useState(null);
  const [baseExpMultiplier, setbaseExpMultiplier] = useState("1");
  const [jobExpMultiplier, setjobExpMultiplier] = useState("1");
  const [dropRateMultiplier, setdropRateMultiplier] = useState("1");
  const [currentLanguage, setcurrentLanguage] = useState("English");
  const [currentEpisode, setcurrentEpisode] = useState(null);
  const [currentLanguageItemIndex, setcurrentLanguageItemIndex] = useState(
    default_index_items
  );
  const [currentLanguageMobIndex, setcurrentLanguageMobIndex] = useState(
    default_index_mobs
  );

  // useEffect(() => {
  //   axios.get("https://vitcunha.com/mob_db_1.json").then((response) => {
  //     setItems(response.data);
  //     setfilteredMobs(response.data);
  //   });
  // }, []);

  useEffect(() => {
    search();
  }, [inputBusca, currentLanguage]);

  const search = () => {
    if (inputBusca === "") return;

    // Updates Mob results array according to search input
    const filteredMobs = mobs.filter((mob) => {
      const friendlyName = currentLanguageMobIndex[mob.ID] || mob.MobShortName;

      return (
        friendlyName.toLowerCase().includes(inputBusca.toLowerCase()) ||
        String(mob.ID).includes(inputBusca)
      );
    });
    setfilteredMobs(filteredMobs);

    // Updates Filtered Items array with search input
    const filteredItems = items.filter((item) => {
      const friendlyName = currentLanguageItemIndex[item.ID] || item.ShortName;

      return (
        friendlyName.toLowerCase().includes(inputBusca.toLowerCase()) ||
        String(item.ID).includes(inputBusca)
      );
    });
    setfilteredItems(filteredItems);
  };

  // Make drop list clickable
  const makeDropClickable = (itemId) => () => {
    setselectedMob(null);
    const newSelectedItem = items.find((item) => item.ID === itemId);
    setselectedItem(newSelectedItem);
  };

  // Set Current Language Function
  const handleChangeLanguage = async (language) => {
    const newMobs = await import(`./jsons/index_${language}_mobs.json`);
    const newItems = await import(`./jsons/index_${language}_items.json`);
    setcurrentLanguageItemIndex(newItems);
    setcurrentLanguageMobIndex(newMobs);
    setcurrentLanguage(language);
  };

  const getSpawnMaps = (ID) => {
    const filteredMaps = spawn.filter((entry) => entry.MobID === ID);
    const spawnList = filteredMaps.map((entry) => (
      <p key={entry.MobID + entry.Map}>
        {entry.Map} - {entry.MobCount}
      </p>
    ));
    return spawnList;
  };

  const SpawnMaps = ({ ID }) => {
    const filteredMaps = spawn.filter((entry) => entry.MobID === ID);
    const mapIDs = filteredMaps.map((entry) => entry.Map);

    const allMonstersInMaps = spawn.filter((entry) =>
      mapIDs.includes(entry.Map)
    );
    console.log(allMonstersInMaps);

    const spawnList = filteredMaps.map((entry) => (
      <p key={entry.MobID + entry.Map}>
        <b>{entry.Map}</b>
        <ul>
          {allMonstersInMaps
            .filter((line) => line.Map == entry.Map)
            .map((line2) => (
              <li>
                {" "}
                {line2.MobDisplayName} - {line2.MobCount}{" "}
              </li>
            ))}
        </ul>
      </p>
    ));
    return spawnList;
  };

  return (
    <div
      className="App"
      style={{
        width: "calc(100vw - 160px)",
        margin: "2em 0",
        padding: "0 80px"
      }}
    >
      <div>
        <div>
          <div style={{ display: "flex", gap: "10px" }}>
            {/* // Base Rate Dropdown Menu */}
            Base:{" "}
            <input
              // type="number"
              // step="1"
              min="1"
              style={{ maxWidth: "15px" }}
              value={baseExpMultiplier}
              onChange={(e) => setbaseExpMultiplier(e.target.value)}
            />
            {/* // Job Rate Dropdown Menu */}
            Job:{" "}
            <input
              // type="number"
              // step="1"
              min="1"
              style={{ maxWidth: "15px" }}
              value={jobExpMultiplier}
              onChange={(e) => setjobExpMultiplier(e.target.value)}
            />
            {/* // Drop Rate Dropdown Menu */}
            Drop:
            <input
              //  type="number"
              // step="1"
              min="1"
              style={{ maxWidth: "15px" }}
              value={dropRateMultiplier}
              onChange={(e) => setdropRateMultiplier(e.target.value)}
            />
            {/* // Language Dropdown Menu */}
            Language:
            <select
              value={currentLanguage}
              onChange={(e) => handleChangeLanguage(e.target.value)}
            >
              <option value="en_us">English</option>
              <option value="pt_br">PortuguÃªs</option>
            </select>
            {/* // Database Dropdown Menu */}
            Episode:
            <select
              value={currentEpisode}
              onChange={(e) => setcurrentEpisode(e.target.value)}
            >
              <option>Pre-Comodo</option>
              <option>Comodo</option>
              <option>Juno</option>
              <option>Lutie</option>
            </select>
            Database:
            <select
              value={currentEpisode}
              onChange={(e) => setcurrentEpisode(e.target.value)}
            >
              <option>kRO</option>
            </select>
          </div>

          <hr />

          <input
            placeholder="Item/Monster Name"
            value={inputBusca}
            onChange={(e) => setinputBusca(e.target.value)}
            style={{ display: "flex" }}
          />

          <hr />

          {/* // Whole Container */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "25px"
            }}
          >
            {/* // Left Container */}
            <div>
              {/* // Item Results List */}
              <p style={{ textAlign: "center" }}>Item</p>
              <select style={{ textAlign: "left", width: "200px" }} size="13">
                {filteredItems.map((item) => (
                  <option
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setselectedMob(null);
                      setselectedItem(item);
                    }}
                  >
                    {item.ID} -{" "}
                    {currentLanguageItemIndex[item.ID] || item.ShortName}
                  </option>
                ))}
              </select>
              <br /> <br />
              {/* // Mob Results List */}
              <p style={{ textAlign: "center" }}>Monsters</p>
              <select style={{ textAlign: "left", width: "200px" }} size="13">
                {filteredMobs.map((mob) => (
                  <option
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setselectedItem(null);
                      setselectedMob(mob);
                    }}
                  >
                    {mob.ID} -{" "}
                    {currentLanguageMobIndex[mob.ID] || mob.MobShortName}
                  </option>
                ))}
              </select>
              {/* // End Mob List */}
            </div>
            {/* // End Left Container*/}
            {/* // Right Container */}
            <div
              style={{
                display: "flex",
                width: "80%",
                border: "1px solid grey",
                textAlign: "Left",
                padding: "12px"
              }}
            >
              {/* // Item Details (when showing item) */}
              {selectedItem !== null && (
                <div>
                  <ul style={{ listStyle: "none", padding: "0" }}>
                    <li>
                      Icon (iro){" "}
                      <img
                        src={`/img/icons-playroru/${selectedItem.ID}.png`}
                      ></img>{" "}
                    </li>
                    <li>
                      Icon (playroru){" "}
                      <img
                        src={`/img/item/${selectedItem.ID}.png`}
                      ></img>{" "}
                    </li>
                    <li>
                      Old image (bRO Veins){" "}
                      <img
                        src={`/img/collection-old/${selectedItem.ID}.png`}
                      ></img>{" "}
                    </li>
                    <li>
                      New Image (iRO){" "}
                      <img
                        src={`/img/collection/${selectedItem.ID}.png`}
                      ></img>{" "}
                    </li>
                    <li>
                      New Image (playroRU){" "}
                      <img
                        src={`/img/images-playroru/${selectedItem.ID}.png`}
                      ></img>{" "}
                    </li>

                    <li>
                      <b>Name:</b> {currentLanguageItemIndex[selectedItem.ID]} |{" "}
                      {selectedItem.ShortName}
                    </li>
                    <li>
                      <b>ID:</b> {selectedItem.ID}
                    </li>
                    <li>
                      <b>NPC Price: </b>
                      {selectedItem.NPCPrice}
                    </li>
                    <li>
                      <b>Sell At: </b> {selectedItem.NPCPrice / 2}
                    </li>
                    {selectedItem.ATK > 0 && (
                      <li>
                        <b>ATK: </b>
                        {selectedItem.ATK}
                      </li>
                    )}
                    {selectedItem.MATK > 0 && (
                      <li>
                        <b>MATK: </b>
                        {selectedItem.MATK}
                      </li>
                    )}
                    {selectedItem.DEF > 0 && (
                      <li>
                        <b>DEF: </b>
                        {selectedItem.DEF}
                      </li>
                    )}
                    {selectedItem.MDEF > 0 && (
                      <li>
                        <b>MDEF: </b>
                        {selectedItem.MDEF}
                      </li>
                    )}
                    {selectedItem.Slots > 0 && (
                      <li>
                        <b>Slots: </b>
                        {selectedItem.Slots}
                      </li>
                    )}
                    {selectedItem.MinLvl > 0 && (
                      <li>
                        <b>MinLvl: </b>
                        {selectedItem.MinLvl}
                      </li>
                    )}
                    <br />
                    {selectedItem.STR > 0 && <li> STR+{selectedItem.STR}</li>}
                    {selectedItem.AGI > 0 && <li> AGI+{selectedItem.AGI}</li>}
                    {selectedItem.VIT > 0 && <li> VIT+{selectedItem.VIT}</li>}
                    {selectedItem.INT > 0 && <li> INT+{selectedItem.INT}</li>}
                    {selectedItem.DEX > 0 && <li> DEX+{selectedItem.DEX}</li>}
                    {selectedItem.LUK > 0 && <li> LUK+{selectedItem.LUK}</li>}

                    {selectedItem.CardHit > 0 && (
                      <li> CardHit+{selectedItem.CardHit}</li>
                    )}
                    {selectedItem.CardCrit > 0 && (
                      <li> CardCrit+{selectedItem.CardCrit}</li>
                    )}
                    {selectedItem.CardFlee > 0 && (
                      <li> CardFlee+{selectedItem.CardFlee}</li>
                    )}
                    {selectedItem.CardSkill > 0 && (
                      <li> CardSkill+{selectedItem.CardSkill}</li>
                    )}
                  </ul>
                </div>
              )}

              {/* // Mob Details (when showing mob) */}
              {selectedMob !== null && (
                <div style={{}}>
                  <ul style={{ listStyle: "none", padding: "0" }}>
                    <li>
                      RMS
                      <img
                        src={`/img/mobs-rms/${selectedMob.ID}.gif`}
                      ></img>
                    </li>
                    <li>
                      Worldrag
                      <img
                        src={`/img/mobs-worldrag/${selectedMob.ID}.gif`}
                      ></img>
                    </li>
                    <li>
                      PlayroRU
                      <img
                        src={`/img/mobs-playroru/${selectedMob.ID}.gif`}
                      ></img>
                    </li>
                    <br />
                    <li>
                      <b>Name:</b> {currentLanguageMobIndex[selectedMob.ID]} |{" "}
                      {selectedMob.MobShortName}
                    </li>
                    <li>
                      <b> ID:</b> {selectedMob.ID}
                    </li>
                    <li>
                      <b> Level:</b> {selectedMob.Lv}
                    </li>
                    <li>
                      <b> HP:</b> {selectedMob.HP}
                    </li>
                    <li>
                      <b> Base Exp:</b> {selectedMob.bEXP * baseExpMultiplier}
                    </li>
                    <li>
                      <b> Job Exp:</b> {selectedMob.jEXP * jobExpMultiplier}
                    </li>
                    <li>
                      <b> Size:</b>
                    </li>
                    <li>
                      <b> Race:</b>
                    </li>
                    <li>
                      <b> Property:</b>
                    </li>
                    <br />
                    <br /> <br />
                    {/* <div>
                      {spawn.map(
                        (entry) =>
                          entry.MobID === selectedMob.ID && (
                            <p key={entry.MobID + entry.Map} href="#">
                              {entry.Map} - {entry.MobCount}
                            </p>
                          )
                      )}
                    </div> */}
                    {/* {getSpawnMaps(selectedMob.ID)} */}
                    <SpawnMaps ID={selectedMob.ID} />
                    {DROP_SLOTS_ARRAY.map(
                      (dropSlot) =>
                        selectedMob[`Drop${dropSlot + 1}`] > 0 && (
                          <DropEntry
                            dropID={selectedMob[`Drop${dropSlot + 1}`]}
                            dropRateMultiplier={dropRateMultiplier}
                            baseDropRate={selectedMob[`Rate${dropSlot + 1}`]}
                            makeDropClickable={makeDropClickable}
                            itemIndex={currentLanguageItemIndex}
                          />
                        )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
