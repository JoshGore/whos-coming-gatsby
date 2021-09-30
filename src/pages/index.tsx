import * as React from "react";
import { graphql } from "gatsby";
import "bootstrap/dist/css/bootstrap.min.css";

interface ISpreadsheetData {
  allGoogleSpreadsheetGatsbyGatsby: {
    nodes: {
      firstName: string;
      lastName: string;
      country: string;
      homeEcclesia: string;
      displayOptions: string | null;
    }[];
  };
}

interface INameData {
  firstName: string;
  lastName: string;
  displayOptions: string | null;
}

interface IEcclesiaData {
  ecclesiaName: string;
  attendees: INameData[];
}

interface ICountryData {
  countryName: string;
  ecclesias: IEcclesiaData[];
}

const spreadsheetDataToCountryData = (
  data: ISpreadsheetData
): ICountryData[] => {
  var nodes = data.allGoogleSpreadsheetGatsbyGatsby.nodes;
  var countries = [
    ...new Set(
      nodes
        .filter((node) => node !== null && node.country !== null)
        .map((node) => node.country.trim())
    ),
  ]
    .sort()
    .reverse();
  var countryData: ICountryData[] = countries.map((country) => {
    var countryAttendees = nodes.filter(
      (node) => node.country.trim() == country.trim()
    );
    var ecclesias = [
      ...new Set(
        countryAttendees
          .filter((node) => node !== null && node.homeEcclesia !== null)
          .map((node) => node.homeEcclesia.trim())
      ),
    ].sort();
    var ecclesiaData: IEcclesiaData[] = ecclesias.map((ecclesia) => {
      var ecclesiaAttendees = countryAttendees.filter(
        (node) => node.homeEcclesia.trim() == ecclesia.trim()
      );
      return {
        ecclesiaName: ecclesia,
        attendees: ecclesiaAttendees,
      };
    });
    return {
      countryName: country,
      ecclesias: ecclesiaData,
    };
  });
  return countryData;
};

const NameEntry: React.FC<INameData> = ({
  firstName,
  lastName,
  displayOptions,
}) => {
  return displayOptions !== null && displayOptions.toLowerCase() == "first" ? (
    <p>
      <b>
        {firstName} {lastName}
      </b>{" "}
      - First book-in!
    </p>
  ) : (
    <p>
      {firstName} {lastName}
    </p>
  );
};

const EcclesiaEntry: React.FC<IEcclesiaData> = ({
  ecclesiaName,
  attendees,
}) => {
  return (
    <div>
      <h5>{ecclesiaName}</h5>
      {attendees.map((attendee) => (
        <NameEntry {...attendee} />
      ))}
    </div>
  );
};

const CountryEntry: React.FC<ICountryData> = ({ countryName, ecclesias }) => {
  return (
    <div>
      <h4>{countryName}</h4>
      {ecclesias.map((ecclesia) => (
        <EcclesiaEntry {...ecclesia} />
      ))}
    </div>
  );
};

const IndexPage = ({ data }: { data: ISpreadsheetData }) => {
  return (
    <main
      className="container-fluid"
      style={{ backgroundColor: "#32442f", color: "whitesmoke" }}
    >
      <div className="row">
        <div
          className="col-sm-6 offset-sm-3 main"
          style={{ textAlign: "center" }}
        >
          {spreadsheetDataToCountryData(data).map((country) => (
            <CountryEntry {...country} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default IndexPage;

export const query = graphql`
  query NamesQuery {
    allGoogleSpreadsheetGatsbyGatsby {
      nodes {
        country
        firstName
        homeEcclesia
        lastName
        displayOptions
      }
    }
  }
`;
