import React, { forwardRef } from 'react';
import { createStyles, makeStyles } from "@material-ui/core";
import { FC } from "react";
import { Rnd } from 'react-rnd';
import QRCode from "qrcode.react";
import { cardSize } from './common';

const fitCardPart = (maxPixles: number) => `min(${maxPixles}px, ${90 * maxPixles / cardSize.width}vw)`;

const useStyles = makeStyles(() => createStyles({
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
}));

type PreviewProps = {
  imageSize: string,
  cardImage: string,
  rarity: string,
  attribute: string,
  name: string,
  title: string,
  ability: string,
  abilityNote: string,
  description: string,
  qrText: string,
  cardImagePosition: {x: number, y: number},
  setCardImagePosition: (position: {x: number, y: number}) => void,
  cardImageSize: {width: number, height: number},
  setCardImageSize: (size: {width: number, height: number}) => void,
  dragActive: boolean
};

export const ResponsivePreview = forwardRef<HTMLDivElement, PreviewProps>(({
  imageSize,
  cardImage,
  rarity,
  attribute,
  name,
  title,
  ability,
  abilityNote,
  description,
  qrText,
  cardImagePosition,
  setCardImagePosition,
  cardImageSize,
  setCardImageSize,
  dragActive
}, cardFrameElement) => {

  const classes = useStyles();

  return <div style={{
    position: "relative",
    width: "90vw",
    maxWidth: `${cardSize.width}px`,
    height: fitCardPart(cardSize.height),
    overflow: "hidden"
  }} id="preview" ref={cardFrameElement}>
    {imageSize === "free" ?
      <Rnd style={{
        backgroundImage: cardImage ? `url(${cardImage})` : "none",
        backgroundSize: "contain",
        border: dragActive ? "1px solid #000000": "none",
        boxSizing: "content-box",
        zIndex: dragActive ? 10 : 0
      }}
      position={cardImagePosition}
      size={cardImageSize}
      lockAspectRatio
      onDragStop={(e, d) => setCardImagePosition({x: d.x, y: d.y})}
      onResizeStop={(e, direction, ref) => setCardImageSize({width: parseInt(ref.style.width), height: parseInt(ref.style.height)})} /> :
      <div className={`${classes.cardPart} ${classes.cardFull}`} style={{
        backgroundImage: cardImage ? `url(${cardImage})` : "none",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: imageSize,
        left: "0", 
        top: "0",
        zIndex: 0
      }}/>
    }
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
      fontSize: fitCardPart(15),
      letterSpacing: abilityNote.length > 40 ? "0px" : fitCardPart(1),
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
  </div>;
});

type ScreenshotProps = {
  imageSize: string,
  cardImage: string,
  rarity: string,
  attribute: string,
  name: string,
  title: string,
  ability: string,
  abilityNote: string,
  description: string,
  qrText: string,
  cardImagePosition: {x: number, y: number},
  cardImageSize: {width: number, height: number},
};
  
export const ScreenshotPreview: FC<ScreenshotProps> = ({
  imageSize,
  cardImage,
  rarity,
  attribute,
  name,
  title,
  ability,
  abilityNote,
  description,
  qrText,
  cardImagePosition,
  cardImageSize
}) => {

  const classes = useStyles();

  return <div style={{position: "relative", width: `${cardSize.width}px`, height: `${cardSize.height}px`, overflow: "hidden"}} id="preview">
    {imageSize === "free" ?
      <div id="cardimage" className={classes.cardPart} style={{
        backgroundImage: cardImage ? `url(${cardImage})` : "none",
        backgroundSize: "contain",
        left: cardImagePosition.x,
        top: cardImagePosition.y,
        width: cardImageSize.width,
        height: cardImageSize.height,
        zIndex: 0
      }}></div> :
      <div id="cardimage" className={`${classes.cardPart} ${classes.cardFull}`} style={{
        backgroundImage: cardImage ? `url(${cardImage})` : "none",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: imageSize,
        left: "0", 
        top: "0",
        zIndex: 0
      }}></div>
    }
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
      fontSize: "15px",
      letterSpacing: `${abilityNote.length > 40 ? 0 : 1}px`,
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
  </div>;
};
