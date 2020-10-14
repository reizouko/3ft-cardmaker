import React, { RefObject } from 'react';
import { createStyles, FormControl, FormControlLabel, FormLabel, Grid, makeStyles, Radio, RadioGroup, Switch, TextField, Theme } from "@material-ui/core";
import { FC, useRef } from "react";
import { attributeButtons, imageSizeButtons, rarityButtons } from './common';

const useStyles = makeStyles((theme: Theme) => createStyles({
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

const createSet = (f: (value: React.SetStateAction<string>) => void) =>
  (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => f(e.target.value);

type EditorProps = {
  setCardImage: (daraUrl: string) => void,
  setCardImagePosition: (newPosition: {x: number, y: number}) => void,
  setCardImageSize: (newSize: {width: number, height: number}) => void,
  imageSize: string,
  setImageSize: (imageSize: string) => void,
  rarity: string,
  setRarity: (rarity: string) => void,
  attribute: string,
  setAttribute: (attribute: string) => void,
  name: string,
  setName: (name: React.SetStateAction<string>) => void,
  title: string,
  setTitle: (title: React.SetStateAction<string>) => void,
  ability: string,
  setAbility: (ability: React.SetStateAction<string>) => void,
  abilityNote: string,
  setAbilityNote: (abilityNote: React.SetStateAction<string>) => void,
  description: string,
  setDescription: (description: React.SetStateAction<string>) => void,
  qrText: string,
  setQrText: (qrText: React.SetStateAction<string>) => void,
  dragActive: boolean,
  setDragActive: (active: boolean) => void,
  cardFrameElement: RefObject<HTMLDivElement>
};
  
const Editor: FC<EditorProps> = ({
  setCardImage,
  setCardImagePosition,
  setCardImageSize,
  imageSize, setImageSize,
  rarity, setRarity,
  attribute, setAttribute,
  name, setName,
  title, setTitle,
  ability, setAbility,
  abilityNote, setAbilityNote,
  description, setDescription,
  qrText, setQrText,
  dragActive, setDragActive,
  cardFrameElement
}) => {

  const fileElement = useRef<HTMLInputElement>(null);

  const fileSelected = () => {
    const files = fileElement.current && fileElement.current.files;
    if (files === null || files.length === 0) {
      setCardImage("");
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setCardImage(reader.result as string);
        const sizeImg = new Image();
        sizeImg.onload = () => {
          const {
            width: cardFrameWidth = 0,
            height: cardFrameHeight = 0
          } = cardFrameElement.current?.getBoundingClientRect() || {};

          const widthRatio = sizeImg.naturalWidth <= cardFrameWidth * 0.9 ? 1 : cardFrameWidth * 0.9 / sizeImg.naturalWidth;
          const heightRatio = sizeImg.naturalHeight <= cardFrameHeight * 0.9 ? 1 : cardFrameHeight * 0.9 / sizeImg.naturalHeight;
          const ratio = Math.min(widthRatio, heightRatio);

          setCardImageSize({
            width: sizeImg.naturalWidth * ratio,
            height: sizeImg.naturalHeight * ratio
          });
          setCardImagePosition({
            x: (cardFrameWidth - sizeImg.naturalWidth * ratio) / 2,
            y: (cardFrameHeight - sizeImg.naturalHeight * ratio) / 2
          });
        };
        sizeImg.src = reader.result as string;
      };
    }
  };

  const classes = useStyles();

  return <>
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">画像</FormLabel>
        <div><input type="file" accept="image/*" ref={fileElement} onChange={fileSelected}/></div>
        <RadioGroup aria-label="imagesize" name="imagesize" value={imageSize} onChange={e => setImageSize(e.target.value)}>
        {
          imageSizeButtons.map(data => <FormControlLabel key={`imagesize_${data.value}`} value={data.value} control={<Radio/>} label={data.label} id={`imagesize_${data.value}`}/>)
        }
        </RadioGroup>
        <Grid container component="label" alignItems="center">
          <Grid item>完成形を見る</Grid>
          <Grid item><Switch checked={dragActive} onChange={e => setDragActive(e.target.checked)} disabled={imageSize !== "free"}/></Grid>
          <Grid item>動かす</Grid>
        </Grid>
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
  </>;
};

export default Editor;