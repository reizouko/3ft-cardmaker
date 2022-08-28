import React, { useRef, useState } from "react";
import "./App.css";
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  attributeButtons,
  cardSize,
  imageSizeButtons,
  rarityButtons,
} from "./common";
import Editor from "./Editor";
import { ResponsivePreview, ScreenshotPreview } from "./Preview";
import html2canvas from "html2canvas";

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const App = () => {
  const [rarity, setRarity] = useState(rarityButtons[0].value);
  const [attribute, setAttribute] = useState(attributeButtons[0].value);
  const [cardImage, setCardImage] = useState("");
  const [imageSize, setImageSize] = useState(imageSizeButtons[0].value);
  const [name, setName] = useState("名前を入れてね");
  const [title, setTitle] = useState("肩書き");
  const [ability, setAbility] = useState("能力名：なんかすごい能力");
  const [abilityNote, setAbilityNote] = useState(
    "能力の説明をここに入れるといいかもしれません。"
  );
  const [description, setDescription] =
    useState("ここに説明テキストを入れてね。");
  const [qrText, setQrText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [cardData, setCardData] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => setDialogOpen(false);
  const [cardImagePosition, setCardImagePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cardImageSize, setCardImageSize] = useState({
    width: 0,
    height: 0,
  });
  const cardFrameElement = useRef<HTMLDivElement>(null);

  const generate = () => {
    setCardData("");
    setDialogOpen(true);

    html2canvas(document.getElementById("screenshot")!!, {
      onclone: (clonedDoc) => {
        clonedDoc.getElementById("screenshot")!!.style.display = "block";
      },
    }).then((canvas) => {
      setCardData(canvas.toDataURL("image/png"));
    });
  };

  return (
    <Container maxWidth="xl">
      <h3>TFTカードジェネレーター</h3>
      <Grid container spacing={3}>
        <Grid item>
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
            ref={cardFrameElement}
          />
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
            cardImagePosition={
              cardFrameElement.current
                ? {
                    x:
                      (cardImagePosition.x /
                        cardFrameElement.current.getBoundingClientRect()
                          .width) *
                      cardSize.width,
                    y:
                      (cardImagePosition.y /
                        cardFrameElement.current.getBoundingClientRect()
                          .height) *
                      cardSize.height,
                  }
                : { x: 0, y: 0 }
            }
            cardImageSize={
              cardFrameElement.current
                ? {
                    width:
                      (cardImageSize.width /
                        cardFrameElement.current!.getBoundingClientRect()
                          .width) *
                      cardSize.width,
                    height:
                      (cardImageSize.height /
                        cardFrameElement.current.getBoundingClientRect()
                          .height) *
                      cardSize.height,
                  }
                : { width: 0, height: 0 }
            }
          />
        </Grid>
        <Grid item>
          <div>
            <p>納得のいく出来になったら「画像に変換」を押してください。</p>
            <Editor
              imageSize={imageSize}
              setImageSize={setImageSize}
              rarity={rarity}
              setRarity={setRarity}
              attribute={attribute}
              setAttribute={setAttribute}
              name={name}
              setName={setName}
              title={title}
              setTitle={setTitle}
              ability={ability}
              setAbility={setAbility}
              abilityNote={abilityNote}
              setAbilityNote={setAbilityNote}
              description={description}
              setDescription={setDescription}
              qrText={qrText}
              setQrText={setQrText}
              setCardImageSize={setCardImageSize}
              setCardImage={setCardImage}
              setCardImagePosition={setCardImagePosition}
              dragActive={dragActive}
              setDragActive={setDragActive}
              cardFrameElement={cardFrameElement}
            />
            <div>
              <Button onClick={generate} variant="contained" color="primary">
                画像に変換
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            backgroundColor: "#efefef",
          },
        }}
      >
        <DialogTitle>
          カード画像
          <CloseButton aria-label="close" onClick={closeDialog}>
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent dividers>
          {cardData ? (
            <>
              <DialogContentText>
                この画像を保存してね。(スマホの場合は画像長押し)
              </DialogContentText>
              <div style={{ textAlign: "center" }}>
                <img
                  src={cardData}
                  style={{ maxWidth: "90%" }}
                  alt="画像に変換したカードです。これを保存してください。"
                />
              </div>
            </>
          ) : (
            <DialogContentText>
              ただいま画像作成中です。しばらくお待ちください…
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default App;
