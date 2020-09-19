import React, { useRef, useState } from 'react';
import './App.css';
import html2canvas from 'html2canvas';
import { Button, Container, FormControl, FormControlLabel, FormLabel, Grid, makeStyles, Radio, RadioGroup, TextField } from '@material-ui/core';
import QRCode from "qrcode.react";

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

const useStyles = makeStyles({
  cardPart: {
    position: "absolute",
    display: "inline-block",
  },
  cardText: {
    position: "absolute",
    display: "inline-block",
    fontFamily: "'Noto Sans JP',sans-serif",
    color: "#ffffff",
    textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
  }
});

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
  const [qrText, setQrText] = useState("");
  const [cardData, setCardData] = useState("");

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

  const generate = () => {
    html2canvas(previewElement.current as HTMLElement, {
      width: cardSize.width,
      height: cardSize.height
    }).then(canvas => {
      setCardData(canvas.toDataURL());
    });
  };

  const classes = useStyles();

  return <Container fixed>
    <Grid container spacing={2}>
      <Grid item>
        <div ref={previewElement} style={{position: "relative", width: `${cardSize.width}px`, height: `${cardSize.height}px`}}>
          <div className={classes.cardPart} style={{
            backgroundImage: cardImage,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: imageSize,
            left: "0", top: "0",
            width: `${cardSize.width}px`, height: `${cardSize.height}px`,
            zIndex: 0
          }}></div>
          <img
            src={`${process.env.PUBLIC_URL}/cardfront/${rarity}_${attribute}.png`}
            width={cardSize.width}
            height={cardSize.height}
            className={classes.cardPart}
            style={{
              left: "0", 
              top: "0",
              zIndex: 1
            }}
          />
          <div id="name" className={classes.cardText} style={{
            left: "152px",
            top: "703px",
            fontWeight: "bold",
            fontSize: "40px",
            letterSpacing: "3px",
            zIndex: 2
          }}>{name}</div>
          <div id="title" className={classes.cardText} style={{
            right: "70px",
            top: "723px",
            fontWeight: 500,
            fontSize: "24px",
            fontStyle: "oblique",
            letterSpacing: "3px",
            zIndex: 3
          }}>{title}</div>
          <div id="ability" className={classes.cardText} style={{
            left: "50%",
            top: "800px",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            fontSize: "22px",
            letterSpacing: "3px",
            zIndex: 4
          }}>{ability}</div>
          <div id="abilityNote" className={classes.cardText} style={{
            left: "40px",
            top: "825px",
            maxWidth: "660px",
            fontSize: "14px",
            letterSpacing: "1px",
            zIndex: 5
          }}>{abilityNote}</div>
          <div id="description" className={classes.cardText} style={{
            left: "40px",
            top: "875px",
            maxWidth: "660px",
            fontSize: "18px",
            letterSpacing: "1px",
            lineHeight: "32px",
            whiteSpace: "pre-wrap",
            zIndex: 6
          }}>{description}</div>
          { qrText.length > 0 && <QRCode value={qrText} size={62} className={classes.cardPart} style={{
            left: "640px",
            top: "47px",
            zIndex: 7
          }}/> }
        </div>
      </Grid>
      <Grid item>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">画像</FormLabel>
            <div><input type="file" accept="image/*" ref={fileElement} onChange={fileSelected}/></div>
            <RadioGroup aria-label="imagesize" name="imagesize" value={imageSize} onChange={e => setImageSize(e.target.value)}>
            {
              imageSizeButtons.map(data => <FormControlLabel key={`imagesize_${data.value}`} value={data.value} control={<Radio/>} label={data.label}/>)
            }
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">レアリティ</FormLabel>
            <RadioGroup aria-label="rarity" name="rarity" value={rarity} onChange={e => setRarity(e.target.value)}>
            {
              rarityButtons.map(data => <FormControlLabel key={`rarity_${data.value}`} value={data.value} control={<Radio/>} label={data.label}/>)
            }
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">属性</FormLabel>
            <RadioGroup aria-label="attribute" name="attribute" value={attribute} onChange={e => setAttribute(e.target.value)}>
            {
              attributeButtons.map(data => <FormControlLabel key={`attribute${data.value}`} value={data.value} control={<Radio/>} label={data.label}/>)
            }
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <div><TextField label="名前" value={name} onChange={e => setName(e.target.value)}/></div>
          <div><TextField label="肩書き" value={title} onChange={e => setTitle(e.target.value)}/></div>
          <div><TextField label="能力" value={ability} onChange={e => setAbility(e.target.value)}/></div>
          <div><TextField label="能力の説明" value={abilityNote} onChange={e => setAbilityNote(e.target.value)}/></div>
          <div><TextField multiline={true} label="説明" value={description} onChange={e => setDescription(e.target.value)}/></div>
          <div><TextField label="QRコードを作りたい場合はテキスト入れてね" value={qrText} onChange={e => setQrText(e.target.value)}/></div>
        </div>
        <div>
          <div><Button onClick={generate} variant="contained" color="primary">カード画像作成</Button></div>
          {cardData && <div><img src={cardData}/></div>}
        </div>
      </Grid>
    </Grid>
  </Container>;
};

export default App;
