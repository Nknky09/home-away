import { formatQuantity } from "@/app/utils/format";

type PropertyDetailsProps = {
  details: {
    bedrooms: number;
    baths: number;
    guests: number;
    beds: number;
  };
};

function PropertiesDetails({
  details: { bedrooms, baths, guests, beds },
}: PropertyDetailsProps) {
  return (
    <p className="text-md font-light">
      <span>{formatQuantity(bedrooms, "bedroom")} </span>
      <span>{formatQuantity(baths, "bath")} </span>
      <span>{formatQuantity(guests, "guest")} </span>
      <span>{formatQuantity(beds, "bed")}</span>
    </p>
  );
}

export default PropertiesDetails;
