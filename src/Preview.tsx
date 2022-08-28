import React, { forwardRef } from "react";
import { styled } from "@mui/material";
import { FC } from "react";
import { Rnd } from "react-rnd";
import { QRCodeSVG } from "qrcode.react";
import { cardSize } from "./common";

const fitCardPart = (maxPixles: number) =>
  `min(${maxPixles}px, ${(90 * maxPixles) / cardSize.width}vw)`;

const CardFull = styled("div")(() => ({
  position: "absolute",
  display: "inline-block",
  margin: 0,
  width: "100%",
  height: "100%",
}));

const CardFullImg = styled("img")(() => ({
  position: "absolute",
  display: "inline-block",
  margin: 0,
  width: "100%",
  height: "100%",
}));

const CardPart = styled("div")(() => ({
  position: "absolute",
  display: "inline-block",
  margin: 0,
}));

const CardText = styled("div")(() => ({
  position: "absolute",
  display: "inline-block",
  fontFamily: "'Noto Sans JP',sans-serif",
  color: "#ffffff",
  textShadow:
    "2px 2px 1px #000000, -2px 2px 1px #000000, 2px -2px 1px #000000, -2px -2px 1px #000000, 2px 0px 1px #000000, 0px 2px 1px #000000, -2px 0px 1px #000000, 0px -2px 1px #000000",
  overflowWrap: "break-word",
  wordWrap: "break-word",
}));

const CardTextThinShadowed = styled("div")(() => ({
  position: "absolute",
  display: "inline-block",
  fontFamily: "'Noto Sans JP',sans-serif",
  color: "#ffffff",
  textShadow:
    "1px 1px 1px #000000, -1px 1px 1px #000000, 1px -1px 1px #000000, -1px -1px 1px #000000, 1px 0px 1px #000000, 0px 1px 1px #000000, -1px 0px 1px #000000, 0px -1px 1px #000000",
  overflowWrap: "break-word",
  wordWrap: "break-word",
}));

type PreviewProps = {
  imageSize: string;
  cardImage: string;
  rarity: string;
  attribute: string;
  name: string;
  title: string;
  ability: string;
  abilityNote: string;
  description: string;
  qrText: string;
  cardImagePosition: { x: number; y: number };
  setCardImagePosition: (position: { x: number; y: number }) => void;
  cardImageSize: { width: number; height: number };
  setCardImageSize: (size: { width: number; height: number }) => void;
  dragActive: boolean;
};

export const ResponsivePreview = forwardRef<HTMLDivElement, PreviewProps>(
  (
    {
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
      dragActive,
    },
    cardFrameElement
  ) => {
    return (
      <div
        style={{
          position: "relative",
          width: "90vw",
          maxWidth: `${cardSize.width}px`,
          height: fitCardPart(cardSize.height),
          overflow: "hidden",
        }}
        ref={cardFrameElement}
        className="preview"
      >
        {imageSize === "free" ? (
          <Rnd
            style={{
              backgroundImage: cardImage ? `url(${cardImage})` : "none",
              backgroundSize: "contain",
              border: dragActive ? "1px solid #000000" : "none",
              boxSizing: "content-box",
              zIndex: dragActive ? 10 : 0,
            }}
            position={cardImagePosition}
            size={cardImageSize}
            lockAspectRatio
            onDragStop={(_e, d) => setCardImagePosition({ x: d.x, y: d.y })}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
              setCardImageSize({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
              });
              setCardImagePosition(position);
            }}
          />
        ) : (
          <CardFull
            style={{
              backgroundImage: cardImage ? `url(${cardImage})` : "none",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: imageSize,
              left: 0,
              top: 0,
              zIndex: 0,
            }}
          />
        )}
        <CardFullImg
          src={`/cardfront/${rarity}_${attribute}.png`}
          style={{
            left: 0,
            top: 0,
            zIndex: 1,
          }}
          alt="カードのプレビュー。現在の設定で、カードはこのように見えます。"
        />
        <CardText
          style={{
            left: `${(152 * 100) / cardSize.width}%`,
            top: `${(703 * 100) / cardSize.height}%`,
            maxWidth: `${(520 * 100) / cardSize.width}%`,
            fontWeight: "bold",
            fontSize: fitCardPart(40),
            letterSpacing:
              name.length > 10
                ? 0
                : name.length > 8
                ? fitCardPart(2)
                : fitCardPart(3),
            zIndex: 2,
          }}
        >
          {name}
        </CardText>
        <CardText
          style={{
            right: `${(70 * 100) / cardSize.width}%`,
            top: `${(723 * 100) / cardSize.height}%`,
            maxWidth: `${(520 * 100) / cardSize.width}%`,
            fontWeight: 500,
            fontSize: fitCardPart(24),
            fontStyle: "oblique",
            letterSpacing:
              title.length > 8
                ? 0
                : title.length > 5
                ? fitCardPart(2)
                : fitCardPart(3),
            zIndex: 3,
          }}
        >
          {title}
        </CardText>
        <CardText
          style={{
            left: "50%",
            top: `${(800 * 100) / cardSize.height}%`,
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: `${(700 * 100) / cardSize.width}%`,
            fontSize: fitCardPart(22),
            letterSpacing:
              ability.length > 30
                ? 0
                : ability.length > 20
                ? fitCardPart(2)
                : fitCardPart(3),
            zIndex: 4,
          }}
        >
          {ability}
        </CardText>
        <CardTextThinShadowed
          style={{
            left: "50%",
            top: `${(825 * 100) / cardSize.height}%`,
            marginRight: "-50%",
            transform: "translate(-50%)",
            maxWidth: `${(660 * 100) / cardSize.width}%`,
            fontSize: fitCardPart(15),
            letterSpacing: abilityNote.length > 40 ? 0 : fitCardPart(1),
            zIndex: 5,
          }}
        >
          {abilityNote}
        </CardTextThinShadowed>
        <CardText
          style={{
            left: `${(40 * 100) / cardSize.width}%`,
            top: `${(874 * 100) / cardSize.height}%`,
            maxWidth: `${(660 * 100) / cardSize.width}%`,
            fontSize: fitCardPart(18),
            letterSpacing: fitCardPart(1),
            lineHeight: fitCardPart(32),
            whiteSpace: "pre-wrap",
            zIndex: 6,
          }}
        >
          {description}
        </CardText>
        {qrText.length > 0 && (
          <CardPart
            style={{
              left: `${(634 * 100) / cardSize.width}%`,
              top: `${(41 * 100) / cardSize.height}%`,
              padding: fitCardPart(2),
              backgroundColor: "#ffffff",
              zIndex: 7,
            }}
          >
            <QRCodeSVG
              value={qrText}
              size={69}
              style={{
                display: "block",
                width: fitCardPart(69),
                height: fitCardPart(69),
              }}
            />
          </CardPart>
        )}
      </div>
    );
  }
);

type ScreenshotProps = {
  imageSize: string;
  cardImage: string;
  rarity: string;
  attribute: string;
  name: string;
  title: string;
  ability: string;
  abilityNote: string;
  description: string;
  qrText: string;
  cardImagePosition: { x: number; y: number };
  cardImageSize: { width: number; height: number };
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
  cardImageSize,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: `${cardSize.width}px`,
        height: `${cardSize.height}px`,
        overflow: "hidden",
        display: "none",
      }}
      id="screenshot"
      className="preview"
    >
      {imageSize === "free" ? (
        <CardPart
          style={{
            backgroundImage: cardImage ? `url(${cardImage})` : "none",
            backgroundSize: "contain",
            left: cardImagePosition.x,
            top: cardImagePosition.y,
            width: cardImageSize.width,
            height: cardImageSize.height,
            zIndex: 0,
          }}
        />
      ) : (
        <CardFull
          style={{
            backgroundImage: cardImage ? `url(${cardImage})` : "none",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: imageSize,
            left: 0,
            top: 0,
            zIndex: 0,
          }}
        />
      )}
      <CardFullImg
        src={`/cardfront/${rarity}_${attribute}.png`}
        style={{
          left: 0,
          top: 0,
          zIndex: 1,
        }}
        alt="カードのプレビュー。現在の設定で、カードはこのように見えます。"
      />
      <CardText
        style={{
          left: "152px",
          top: "703px",
          maxWidth: "520px",
          fontWeight: "bold",
          fontSize: "40px",
          letterSpacing: `${name.length > 10 ? 0 : name.length > 8 ? 2 : 3}px`,
          zIndex: 2,
        }}
      >
        {name}
      </CardText>
      <CardText
        style={{
          right: "70px",
          top: "723px",
          maxWidth: "520px",
          fontWeight: 500,
          fontSize: "24px",
          fontStyle: "oblique",
          letterSpacing: `${title.length > 8 ? 0 : title.length > 5 ? 2 : 3}px`,
          zIndex: 3,
        }}
      >
        {title}
      </CardText>
      <CardText
        style={{
          left: "50%",
          top: "800px",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "700px",
          fontSize: "22px",
          letterSpacing: `${
            ability.length > 30 ? 0 : ability.length > 20 ? 2 : 3
          }px`,
          zIndex: 4,
        }}
      >
        {ability}
      </CardText>
      <CardTextThinShadowed
        style={{
          left: "50%",
          top: "825px",
          marginRight: "-50%",
          transform: "translate(-50%)",
          maxWidth: "660px",
          fontSize: "15px",
          letterSpacing: `${abilityNote.length > 40 ? 0 : 1}px`,
          zIndex: 5,
        }}
      >
        {abilityNote}
      </CardTextThinShadowed>
      <CardText
        style={{
          left: "40px",
          top: "874px",
          maxWidth: "660px",
          fontSize: "18px",
          letterSpacing: "1px",
          lineHeight: "32px",
          whiteSpace: "pre-wrap",
          zIndex: 6,
        }}
      >
        {description}
      </CardText>
      {qrText.length > 0 && (
        <CardPart
          style={{
            left: "634px",
            top: "41px",
            padding: "2px",
            backgroundColor: "#ffffff",
            zIndex: 7,
          }}
        >
          <QRCodeSVG
            value={qrText}
            size={69}
            style={{
              display: "block",
            }}
          />
        </CardPart>
      )}
    </div>
  );
};
