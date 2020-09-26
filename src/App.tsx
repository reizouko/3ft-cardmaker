import React, { useRef, useState } from 'react';
import './App.css';
import { Button, Container, createStyles, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, IconButton, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core';
import QRCode from "qrcode.react";
import { RouteComponentProps } from 'react-router-dom';
import querystring from "querystring";
import CloseIcon from '@material-ui/icons/Close';

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

const useStyles = makeStyles((theme: Theme) => createStyles({
  cardPart: {
    position: "absolute",
    display: "inline-block",
    margin: "0"
  },
  cardFull: {
    width: "100%",
    height: "100%"
  },
  cardText: {
    position: "absolute",
    display: "inline-block",
    fontFamily: "'Noto Sans JP',sans-serif",
    color: "#ffffff",
    textShadow: "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
    overflowWrap: "break-word",
    wordWrap: "break-word"
  },
  thinShadow: {
    textShadow: "1px 1px 1px #000000, -1px 1px 1px #000000, 1px -1px 1px #000000, -1px -1px 1px #000000, 1px 0px 1px #000000, 0px 1px 1px #000000, -1px 0px 1px #000000, 0px -1px 1px #000000"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  inputArea: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const fitCardPart = (maxPixles: number) => `min(${maxPixles}px, ${90 * maxPixles / cardSize.width}vw)`;

const createSet = (f: (value: React.SetStateAction<string>) => void) =>
  (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => f(e.target.value);

const takeFirst = (target: string | string[]): string | null => {
  if (typeof target === "string") {
    return target;
  } else if (Array.isArray(target) && target.length > 0) {
    return target[0];
  } else {
    return null;
  }
};
    
interface Props extends RouteComponentProps<{}> {}

const App = (props: Props) => {
  const search = props.location.search;
  const queryObject = querystring.parse(search.startsWith("?") ? search.substring(1) : search);

  const queries = {
    rarity: takeFirst(queryObject.rarity),
    attribute: takeFirst(queryObject.attribute),
    iamgeSize: takeFirst(queryObject.imageSize),
    name: takeFirst(queryObject.name),
    title: takeFirst(queryObject.title),
    ability: takeFirst(queryObject.ability),
    abilityNote: takeFirst(queryObject.abilityNote),
    description: takeFirst(queryObject.description),
    qrText: takeFirst(queryObject.qrText),
    screenshot: takeFirst(queryObject.screenshot),
  };

  const [rarity, setRarity] = useState(queries.rarity && rarityButtons.some(b => b.value === queries.rarity) ? queries.rarity : rarityButtons[0].value);
  const [attribute, setAttribute] = useState(queries.attribute && attributeButtons.some(b => b.value === queries.attribute) ? queries.attribute : attributeButtons[0].value);
  const [cardImage, setCardImage] = useState("");
  const [imageSize, setImageSize] = useState(queries.iamgeSize && imageSizeButtons.some(b => b.value === queries.iamgeSize) ? queries.iamgeSize : imageSizeButtons[0].value);
  const [name, setName] = useState(queries.name || "名前を入れてね");
  const [title, setTitle] = useState(queries.title || "肩書き");
  const [ability, setAbility] = useState(queries.ability || "能力名：なんかすごい能力");
  const [abilityNote, setAbilityNote] = useState(queries.abilityNote || "能力の説明をここに入れるといいかもしれません。");
  const [description, setDescription] = useState(queries.description || "ここに説明テキストを入れてね。");
  const [qrText, setQrText] = useState(queries.qrText || "");
  const [cardData, setCardData] = useState("");

  const fileElement = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => setDialogOpen(false);

  const fileSelected = () => {
    const files = fileElement.current && fileElement.current.files;
    if (files === null || files.length === 0) {
      setCardImage("");
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setCardImage(reader.result as string);
      };
    }
  };

  const generate = () => {
    setCardData("");
    setDialogOpen(true);
    fetch("https://ik3kiulcre.execute-api.ap-northeast-1.amazonaws.com/Prod/make", {
      method: "POST",
      body: JSON.stringify({
        imageSize: imageSize,
        rarity: rarity,
        attribute: attribute,
        name: name,
        title: title,
        ability: ability,
        abilityNote: abilityNote,
        description: description,
        qrText: qrText,
        cardImage: cardImage
      })
    }).then(response => response.json()).then(json => {
      setCardData(`data:image/png;base64,${json.image}`);
    }).catch(err => {
      console.log("通信エラー");
      console.log(err);
    });
  };

  const classes = useStyles();

  return <Container>
    <h3>TFTカードジェネレーター</h3>
    <Grid container spacing={3}>
      <Grid item>
        {
          queries.screenshot === "true" ?
          <div style={{position: "relative", width: `${cardSize.width}px`, height: `${cardSize.height}px`}} id="preview">
            <div id="cardimage" className={`${classes.cardPart} ${classes.cardFull}`} style={{
              backgroundImage: cardImage ? `url(${cardImage})` : "none",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: imageSize,
              left: "0", 
              top: "0",
              zIndex: 0
            }}></div>
            <img
              src={`${process.env.PUBLIC_URL}/cardfront/${rarity}_${attribute}.png`}
              className={`${classes.cardPart} ${classes.cardFull}`}
              style={{
                left: "0", 
                top: "0",
                zIndex: 1
              }}
              alt="カードのプレビュー。現在の設定で、カードはこのように見えます。"
            />
            <div id="name" className={classes.cardText} style={{
              left: "152px",
              top: "703px",
              maxWidth: "520px",
              fontWeight: "bold",
              fontSize: "40px",
              letterSpacing: `${name.length > 10 ? 0 : name.length > 8 ? 2 : 3}px`,
              zIndex: 2
            }}>{name}</div>
            <div id="title" className={classes.cardText} style={{
              right: "70px",
              top: "723px",
              maxWidth: "520px",
              fontWeight: 500,
              fontSize: "24px",
              fontStyle: "oblique",
              letterSpacing: `${title.length > 8 ? 0 : title.length > 5 ? 2 : 3}px`,
              zIndex: 3
            }}>{title}</div>
            <div id="ability" className={classes.cardText} style={{
              left: "50%",
              top: "800px",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "700px",
              fontSize: "22px",
              letterSpacing: `${ability.length > 30 ? 0 : ability.length > 20 ? 2 : 3}px`,
              zIndex: 4
            }}>{ability}</div>
            <div id="abilityNote" className={`${classes.cardText} ${classes.thinShadow}`} style={{
              left: "40px",
              top: "825px",
              maxWidth: "660px",
              fontSize: "14px",
              letterSpacing: `${abilityNote.length > 42 ? 0 : 1}px`,
              zIndex: 5
            }}>{abilityNote}</div>
            <div id="description" className={classes.cardText} style={{
              left: "40px",
              top: "874px",
              maxWidth: "660px",
              fontSize: "18px",
              letterSpacing: "1px",
              lineHeight: "32px",
              whiteSpace: "pre-wrap",
              zIndex: 6
            }}>{description}</div>
            { qrText.length > 0 && <div className={classes.cardPart} style={{
              left: "634px",
              top: "41px",
              padding: "2px",
              backgroundColor: "#ffffff",
              zIndex: 7
            }}><QRCode value={qrText} size={69} style={{
              display: "block"
            }}/></div> }
          </div> :
          <div style={{position: "relative", width: "90vw", maxWidth: `${cardSize.width}px`, height: fitCardPart(cardSize.height)}} id="preview">
            <div className={`${classes.cardPart} ${classes.cardFull}`} style={{
              backgroundImage: cardImage ? `url(${cardImage})` : "none",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: imageSize,
              left: "0", 
              top: "0",
              zIndex: 0
            }}></div>
            <img
              src={`${process.env.PUBLIC_URL}/cardfront/${rarity}_${attribute}.png`}
              className={`${classes.cardPart} ${classes.cardFull}`}
              style={{
                left: "0", 
                top: "0",
                zIndex: 1
              }}
              alt="カードのプレビュー。現在の設定で、カードはこのように見えます。"
            />
            <div className={classes.cardText} style={{
              left: `${152 * 100 / cardSize.width}%`,
              top: `${703 * 100 / cardSize.height}%`,
              maxWidth: `${520 * 100 / cardSize.width}%`,
              fontWeight: "bold",
              fontSize: fitCardPart(40),
              letterSpacing: name.length > 10 ? "0px" : name.length > 8 ? fitCardPart(2) : fitCardPart(3),
              zIndex: 2
            }}>{name}</div>
            <div className={classes.cardText} style={{
              right: `${70 * 100 / cardSize.width}%`,
              top: `${723 * 100 / cardSize.height}%`,
              maxWidth: `${520 * 100 / cardSize.width}%`,
              fontWeight: 500,
              fontSize: fitCardPart(24),
              fontStyle: "oblique",
              letterSpacing: title.length > 8 ? "0px" : title.length > 5 ? fitCardPart(2) : fitCardPart(3),
              zIndex: 3
            }}>{title}</div>
            <div className={classes.cardText} style={{
              left: "50%",
              top: `${800 * 100 / cardSize.height}%`,
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              maxWidth: `${700 * 100 / cardSize.width}%`,
              fontSize: fitCardPart(22),
              letterSpacing: ability.length > 30 ? "0px" : ability.length > 20 ? fitCardPart(2) : fitCardPart(3),
              zIndex: 4
            }}>{ability}</div>
            <div className={`${classes.cardText} ${classes.thinShadow}`} style={{
              left: `${40 * 100 / cardSize.width}%`,
              top: `${825 * 100 / cardSize.height}%`,
              maxWidth: `${660 * 100 / cardSize.width}%`,
              fontSize: fitCardPart(14),
              letterSpacing: abilityNote.length > 42 ? "0px" : fitCardPart(1),
              zIndex: 5
            }}>{abilityNote}</div>
            <div className={classes.cardText} style={{
              left: `${40 * 100 / cardSize.width}%`,
              top: `${874 * 100 / cardSize.height}%`,
              maxWidth: `${660 * 100 / cardSize.width}%`,
              fontSize: fitCardPart(18),
              letterSpacing: fitCardPart(1),
              lineHeight: fitCardPart(32),
              whiteSpace: "pre-wrap",
              zIndex: 6
            }}>{description}</div>
            { qrText.length > 0 && <div className={classes.cardPart} style={{
              left: `${634 * 100 / cardSize.width}%`,
              top: `${41 * 100 / cardSize.height}%`,
              padding: fitCardPart(2),
              backgroundColor: "#ffffff",
              zIndex: 7
            }}><QRCode value={qrText} size={69} style={{
              display: "block",
              width: fitCardPart(69),
              height: fitCardPart(69),
            }}/></div> }
          </div>
        }
      </Grid>
      <Grid item>
        <p>納得のいく出来になったら「画像に変換」を押してください。</p>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">画像</FormLabel>
            <div><input type="file" accept="image/*" ref={fileElement} onChange={fileSelected}/></div>
            <RadioGroup aria-label="imagesize" name="imagesize" value={imageSize} onChange={e => setImageSize(e.target.value)}>
            {
              imageSizeButtons.map(data => <FormControlLabel key={`imagesize_${data.value}`} value={data.value} control={<Radio/>} label={data.label} id={`imagesize_${data.value}`}/>)
            }
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">レアリティ</FormLabel>
            <RadioGroup row aria-label="rarity" name="rarity" value={rarity} onChange={e => setRarity(e.target.value)}>
            {
              rarityButtons.map(data => <FormControlLabel key={`rarity_${data.value}`} value={data.value} control={<Radio/>} label={data.label} id={`rarity_${data.value}`}/>)
            }
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">属性</FormLabel>
            <RadioGroup row aria-label="attribute" name="attribute" value={attribute} onChange={e => setAttribute(e.target.value)}>
            {
              attributeButtons.map(data =>
                <FormControlLabel key={`attribute_${data.value}`} value={data.value} control={<Radio/>} label={data.label} id={`attribute_${data.value}`}/>
              )
            }
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <div className={classes.inputArea}><TextField label="名前" value={name} onChange={createSet(setName)} id="name" fullWidth/></div>
          <div className={classes.inputArea}><TextField label="肩書き" value={title} onChange={createSet(setTitle)} id="title" fullWidth/></div>
          <div className={classes.inputArea}><TextField label="能力" value={ability} onChange={createSet(setAbility)} id="ability" fullWidth/></div>
          <div className={classes.inputArea}><TextField label="能力の説明" value={abilityNote} onChange={createSet(setAbilityNote)} id="abilityNote" fullWidth/></div>
          <div className={classes.inputArea}><TextField multiline label="説明" value={description} onChange={createSet(setDescription)} id="description" fullWidth/></div>
          <div className={classes.inputArea}><TextField multiline label="QRコード" helperText="QRコードにしたいテキスト(文字列)やURLがあれば入力してね" value={qrText} onChange={createSet(setQrText)} id="qrText" fullWidth/></div>
        </div>
        <div>
          <div><Button onClick={generate} variant="contained" color="primary">画像に変換</Button></div>
        </div>
      </Grid>
    </Grid>
    <Dialog open={dialogOpen} onClose={closeDialog} PaperProps={{
      style: {
        backgroundColor: "#efefef"
      }
    }}>
      <DialogTitle>
        カード画像
        <IconButton aria-label="close" className={classes.closeButton} onClick={closeDialog}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {
          cardData ?
            <>
              <DialogContentText>この画像を保存してね。(スマホの場合は画像長押し)</DialogContentText>
              <div style={{textAlign: "center"}}><img src={cardData} style={{maxWidth: "90%"}} alt="画像に変換したカードです。これを保存してください。"/></div>
            </> :
            <DialogContentText>ただいま画像作成中です。しばらくお待ちください…</DialogContentText>
        }
      </DialogContent>
    </Dialog>
  </Container>;
};

export default App;
