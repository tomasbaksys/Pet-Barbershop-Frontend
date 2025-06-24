import React, { useCallback } from "react";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  id: number;
  name: string;
  price: number; // price in euros, integer or float
  durationMinutes: number;
  imageUrl?: string;
  isLoading?: boolean;
  onSelect?: (id: number) => void;
}

// Format price in Euros for Lithuania locale
const formatPrice = (price: number): string =>
  price.toLocaleString("lt-LT", { style: "currency", currency: "EUR" });

// Format duration string in Lithuanian
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min.`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} val. ${mins} min.` : `${hrs} val.`;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  price,
  durationMinutes,
  imageUrl,
  isLoading = false,
  onSelect,
}) => {
  const handleSelect = useCallback(() => {
    if (onSelect) onSelect(id);
  }, [id, onSelect]);

  if (isLoading) {
    return (
      <article
        className={styles.card}
        aria-busy="true"
        aria-label="Kraunama paslauga"
      >
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonTextShort} />
      </article>
    );
  }

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      aria-label={`Paslauga: ${name}, kaina ${formatPrice(
        price
      )}, trukmė ${formatDuration(durationMinutes)}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${name} paslauga`} className={styles.image} />
      ) : (
        <div className={styles.placeholderImage} aria-hidden="true" />
      )}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>{formatPrice(price)}</p>
        <p className={styles.duration}>{formatDuration(durationMinutes)}</p>
      </div>
    </article>
  );
};

export default ServiceCard;
