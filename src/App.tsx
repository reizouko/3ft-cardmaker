import React, { useRef, useState } from 'react';
import './App.css';
import { Button, Container, createStyles, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, makeStyles, Theme } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import querystring from "querystring";
import CloseIcon from '@material-ui/icons/Close';
import { attributeButtons, cardSize, FilterValues, imageSizeButtons, rarityButtons } from './common';
import Editor from './Editor';
import { ResponsivePreview, ScreenshotPreview } from './Preview';

const useStyles = makeStyles((theme: Theme) => createStyles({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
}));

const takeFirst = (target: string | string[]): string | null => {
  if (typeof target === "string") {
    return target;
  } else if (Array.isArray(target) && target.length > 0) {
    return target[0];
  } else {
    return null;
  }
};

const parseFilterValues = (filterValuesParameter: string | string[]): FilterValues | null => {
  const filterValuesString = takeFirst(filterValuesParameter);
  try {
    return filterValuesString ? JSON.parse(filterValuesString) : null;
  } catch (e) {
    console.error(`Couldn't parse to create JSON: ${filterValuesString}`);
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
    imageSize: takeFirst(queryObject.imageSize),
    name: takeFirst(queryObject.name),
    title: takeFirst(queryObject.title),
    ability: takeFirst(queryObject.ability),
    abilityNote: takeFirst(queryObject.abilityNote),
    description: takeFirst(queryObject.description),
    qrText: takeFirst(queryObject.qrText),
    screenshot: takeFirst(queryObject.screenshot),
    imageX: parseFloat(takeFirst(queryObject.imageX) ?? "0"),
    imageY: parseFloat(takeFirst(queryObject.imageY) ?? "0"),
    imageWidth: parseFloat(takeFirst(queryObject.imageWidth) ?? "0"),
    imageHeight: parseFloat(takeFirst(queryObject.imageHeight) ?? "0"),
    filter: parseFilterValues(queryObject.filter)
  };

  const [rarity, setRarity] = useState(queries.rarity && rarityButtons.some(b => b.value === queries.rarity) ? queries.rarity : rarityButtons[0].value);
  const [attribute, setAttribute] = useState(queries.attribute && attributeButtons.some(b => b.value === queries.attribute) ? queries.attribute : attributeButtons[0].value);
  const [cardImage, setCardImage] = useState("");
  const [imageSize, setImageSize] = useState(queries.imageSize && imageSizeButtons.some(b => b.value === queries.imageSize) ? queries.imageSize : imageSizeButtons[0].value);
  const [name, setName] = useState(queries.name || "名前を入れてね");
  const [title, setTitle] = useState(queries.title || "肩書き");
  const [ability, setAbility] = useState(queries.ability || "能力名：なんかすごい能力");
  const [abilityNote, setAbilityNote] = useState(queries.abilityNote || "能力の説明をここに入れるといいかもしれません。");
  const [description, setDescription] = useState(queries.description || "ここに説明テキストを入れてね。");
  const [qrText, setQrText] = useState(queries.qrText || "");
  const [cardData, setCardData] = useState("");
  const [dragActive, setDragActive] = useState(queries.screenshot !== "true");
  const [filterValues, setFilterValues] = useState<FilterValues>(queries.filter ?? {
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => setDialogOpen(false);
  const [cardImagePosition, setCardImagePosition] = useState({
    x: queries.imageX,
    y: queries.imageY
  });
  const [cardImageSize, setCardImageSize] = useState({
    width: queries.imageWidth,
    height: queries.imageHeight
  });
  const cardFrameElement = useRef<HTMLDivElement>(null);

  const generate = () => {
    setCardData("");
    setDialogOpen(true);

    const {
      width: cardFrameWidth = 0,
      height: cardFrameHeight = 0
    } = cardFrameElement.current?.getBoundingClientRect() || {};
    
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
        cardImage: cardImage,
        imageX: cardImagePosition.x / cardFrameWidth * cardSize.width,
        imageY: cardImagePosition.y / cardFrameHeight * cardSize.height,
        imageWidth: cardImageSize.width / cardFrameWidth * cardSize.width,
        imageHeight: cardImageSize.height / cardFrameHeight * cardSize.height,
        filter: JSON.stringify(filterValues)
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
              <ScreenshotPreview
                imageSize={imageSize}
                cardImage={cardImage}
                rarity={rarity}
                attribute={attribute}
                name={name}
                title={title}
                ability={ability}
                abilityNote={abilityNote}
                description={description}
                qrText={qrText}
                cardImagePosition={cardImagePosition}
                cardImageSize={cardImageSize}
                filterValues={filterValues}
              /> :
              <ResponsivePreview
                imageSize={imageSize}
                cardImage={cardImage}
                rarity={rarity}
                attribute={attribute}
                name={name}
                title={title}
                ability={ability}
                abilityNote={abilityNote}
                description={description}
                qrText={qrText}
                cardImagePosition={cardImagePosition}
                setCardImagePosition={setCardImagePosition}
                cardImageSize={cardImageSize}
                setCardImageSize={setCardImageSize}
                dragActive={dragActive}
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                ref={cardFrameElement}
              />
          }
      </Grid>
      <Grid item>
        <div>
          <p>納得のいく出来になったら「画像に変換」を押してください。</p>
          <Editor
            imageSize={imageSize} setImageSize={setImageSize}
            rarity={rarity} setRarity={setRarity}
            attribute={attribute} setAttribute={setAttribute}
            name={name} setName={setName}
            title={title} setTitle={setTitle}
            ability={ability} setAbility={setAbility}
            abilityNote={abilityNote} setAbilityNote={setAbilityNote}
            description={description} setDescription={setDescription}
            qrText={qrText} setQrText={setQrText}
            setCardImageSize={setCardImageSize}
            setCardImage={setCardImage}
            setCardImagePosition={setCardImagePosition}
            dragActive={dragActive} setDragActive={setDragActive}
            cardFrameElement={cardFrameElement}
          />
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
