import React, { useRef, useState } from 'react';
import './App.css';
import html2canvas from 'html2canvas';

const cardSize = {
  width: 744,
  height: 1039
};

const rarityButtons = [
  {value: "c", label: "C"},
  {value: "r", label: "R"},
  {value: "sr", label: "SR"},
  {value: "ur", label: "UR"},
];
const attributeButtons = [
  {value: "gem", label: "ジェム"},
  {value: "sword", label: "ソード"},
  {value: "flower", label: "フラワー"},
];
const imageSizeButtons = [
  {value: "cover", label: "カードを覆うように配置する"},
  {value: "contain", label: "カードに収まるように配置する"},
]

const App: React.FC = () => {
  const [rarity, setRarity] = useState(rarityButtons[0].value);
  const [attribute, setAttribute] = useState(attributeButtons[0].value);
  const [cardImage, setCardImage] = useState("none");
  const [imageSize, setImageSize] = useState(imageSizeButtons[0].value);
  const [name, setName] = useState("名前を入れてね");
  const [title, setTitle] = useState("肩書き");
  const [ability, setAbility] = useState("能力名：なんかすごい能力");
  const [abilityNote, setAbilityNote] = useState("能力の説明をここに入れるといいかもしれません。");
  const [description, setDescription] = useState("ここに説明テキストを入れてね。");

  const fileElement = useRef<HTMLInputElement>(null);
  const previewElement = useRef<HTMLDivElement>(null);

  const fileSelected = () => {
    const files = fileElement.current && fileElement.current.files;
    if (files === null || files.length === 0) {
      setCardImage("none");
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setCardImage(`url(${reader.result})`);
      };
    }
  };

  const download = () => {
    html2canvas(previewElement.current as HTMLElement, {
      x: 0,
      y: 0,
      width: cardSize.width,
      height: cardSize.height
    }).then(canvas => {
      const downloadLink = document.createElement("a");
      downloadLink.href = canvas.toDataURL();
      downloadLink.download = "card.png";
      downloadLink.click();
    });
  };

  return <>
    <div id="cardpreview" ref={previewElement} style={{position: "relative", width: `${cardSize.width}px`, height: `${cardSize.height}px`, margin: "20px"}}>
      <div style={{
        backgroundImage: cardImage,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: imageSize,
        position: "absolute", left: "0", top: "0",
        width: `${cardSize.width}px`, height: `${cardSize.height}px`,
        zIndex: 0
      }}></div>
      <img
        src={`${process.env.PUBLIC_URL}/cardfront/${rarity}_${attribute}.png`}
        width={cardSize.width}
        height={cardSize.height}
        style={{
          position: "absolute",
          left: "0", 
          top: "0",
          zIndex: 1
        }}
      />
      <div id="name" style={{
        position: "absolute",
        display: "inline-block",
        left: "150px",
        top: "705px",
        color: "#ffffff",
        font: "bold 40px メイリオ",
        letterSpacing: "3px",
        textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
        zIndex: 2
      }}>{name}</div>
      <div id="title" style={{
        position: "absolute",
        display: "inline-block",
        right: "75px",
        top: "725px",
        color: "#ffffff",
        font: "bold 22px メイリオ",
        letterSpacing: "3px",
        textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
        zIndex: 3
      }}>{title}</div>
      <div id="ability" style={{
        position: "absolute",
        display: "block",
        left: "50%",
        top: "800px",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        color: "#ffffff",
        font: "normal 22px メイリオ",
        letterSpacing: "3px",
        textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
        zIndex: 4
      }}>{ability}</div>
      <div id="abilityNote" style={{
        position: "absolute",
        display: "inline-block",
        left: "40px",
        top: "825px",
        maxWidth: "660px",
        color: "#ffffff",
        font: "normal 14px メイリオ",
        letterSpacing: "1px",
        textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
        zIndex: 5
      }}>{abilityNote}</div>
      <div id="description" style={{
        position: "absolute",
        display: "inline-block",
        left: "40px",
        top: "875px",
        maxWidth: "660px",
        color: "#ffffff",
        font: "normal 18px メイリオ",
        letterSpacing: "1px",
        lineHeight: "32px",
        whiteSpace: "pre-wrap",
        textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
        zIndex: 5
      }}>{description}</div>
    </div>
    <div id="parameters">
      <form>
        <div>
          <div>画像ファイル</div>
          <div><input type="file" accept="image/*" ref={fileElement} onChange={fileSelected}/></div>
          {
            imageSizeButtons.map(data => <label key={`size_${data.value}`}>
              <input type="radio" name="imagesize" value={data.value} checked={imageSize === data.value} onChange={() => setImageSize(data.value)}/>
              {data.label}
            </label>)
          }
        </div>
        <div>
          <div>レアリティ</div>
          {
            rarityButtons.map(data => <label key={`rarity_${data.value}`}>
              <input type="radio" name="rarity" value={data.value} checked={rarity === data.value} onChange={() => setRarity(data.value)}/>
              {data.label}
            </label>)
          }
        </div>
        <div>
          <div>属性</div>
          {
            attributeButtons.map(data => <label key={`attribute_${data.value}`}>
              <input type="radio" name="attribute" value={data.value} checked={attribute === data.value} onChange={() => setAttribute(data.value)}/>
              {data.label}
            </label>)
          }
        </div>
        <div>
          <div>名前</div>
          <input type="text" value={name} onChange={e => setName(e.target.value)}/>
        </div>
        <div>
          <div>肩書き</div>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div>
          <div>能力</div>
          <input type="text" value={ability} onChange={e => setAbility(e.target.value)}/>
        </div>
        <div>
          <div>能力の説明</div>
          <input type="text" value={abilityNote} onChange={e => setAbilityNote(e.target.value)}/>
        </div>
        <div>
          <div>説明</div>
          <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
        <div>
          <button type="button" onClick={download}>ダウンロード</button>
        </div>
      </form>
    </div>
  </>;
};

export default App;
