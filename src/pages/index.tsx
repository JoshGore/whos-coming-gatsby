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
    }[];
  };
}

interface INameData {
  firstName: string;
  lastName: string;
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
  var countries = [...new Set(nodes.map((node) => node.country))].filter(
    (node) => node != null
  ).sort().reverse();
  console.log(countries);
  var countryData: ICountryData[] = countries.map((country) => {
    var countryAttendees = nodes.filter((node) => node.country == country);
    var ecclesias = [
      ...new Set(countryAttendees.map((attendee) => attendee.homeEcclesia)),
    ].sort();
    console.log({ country, ecclesias });
    var ecclesiaData: IEcclesiaData[] = ecclesias.map((ecclesia) => {
      var ecclesiaAttendees = countryAttendees.filter(
        (node) => node.homeEcclesia == ecclesia
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

const NameEntry: React.FC<INameData> = ({ firstName, lastName }) => {
  return (
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
      }
    }
  }
`;
