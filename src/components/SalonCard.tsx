import React, { useCallback } from "react";
import styles from "./SalonCard.module.css";

interface SalonCardProps {
  id: number;
  name: string;
  ownerName?: string;
  imageUrl?: string;
  isLoading?: boolean;
  onSelect?: (id: number) => void;
}

const SalonCard: React.FC<SalonCardProps> = ({
  id,
  name,
  ownerName,
  imageUrl,
  isLoading = false,
  onSelect,
}) => {
  const handleSelect = useCallback(() => {
    if (onSelect) {
      onSelect(id);
    }
  }, [id, onSelect]);

  if (isLoading) {
    return (
      <article className={styles.card} aria-busy="true" aria-label="Loading salon">
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonText} />
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
      aria-label={`Salon: ${name}${ownerName ? `, owned by ${ownerName}` : ""}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${name} salon`} className={styles.image} />
      ) : (
        <div className={styles.placeholderImage} aria-hidden="true" />
      )}
      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        {ownerName && <p className={styles.owner}>Owned by {ownerName}</p>}
      </div>
    </article>
  );
};

export default SalonCard;
