import {Component} from 'react';

import GeoServer from '../model/GeoServer.js';
import GIGServer from '../model/GIGServer.js';

import Infobox, {
  renderLatLng,
  getRegionInfoItem,
  getPlaceInfoItem,
} from '../components/Infobox.js';

export default class LocationInfobox extends Component {
  async componentDidMount() {
    const {latLng} = this.props;

    const {
      province: provinceID,
      district: districtID,
      dsd: dsdID,
      gnd: gndID,
    } = await GeoServer.getRegionInfo(latLng);

    const provinceData = await GIGServer.getEntity(provinceID);
    const districtData = await GIGServer.getEntity(districtID);
    const dsdData = await GIGServer.getEntity(dsdID);
    const gndData = await GIGServer.getEntity(gndID);

    const pdID = gndData['pd_id'];
    const edID = pdID.substring(0, 5);

    const pdData = await GIGServer.getEntity(pdID);
    const edData = await GIGServer.getEntity(edID);

    this.setState({
      provinceID,
      districtID,
      dsdID,
      gndID,
      provinceData,
      districtData,
      dsdData,
      gndData,

      edID,
      edData,
      pdID,
      pdData,

      nearbyPlaces: await GIGServer.getNearby(latLng),
    });
  }

  render() {
    if (!this.state) {
      return null;
    }
    const {
      provinceID,
      districtID,
      dsdID,
      gndID,

      provinceData,
      districtData,
      dsdData,
      gndData,

      edID,
      edData,
      pdID,
      pdData,

      nearbyPlaces,
    } = this.state;

    let info = [];

    if (gndID) {
      info.push({label: 'Police'});
      info = [].concat(info, nearbyPlaces.map(
        function(nearbyPlaces) {
          return getPlaceInfoItem(
              nearbyPlaces.entity_type,
              nearbyPlaces.entity,
              nearbyPlaces.distance,
            );
        }
      ));

      info.push({label: 'Admnistration'});
      info = [].concat(info, [
        [gndID, gndData],
        [dsdID, dsdData],
        [districtID, districtData],
        [provinceID, provinceData],
      ].map(
        function([regionID, regionData]) {
          return getRegionInfoItem(regionID, regionData);
        }
      ));

      info.push({label: 'Elections'});
      info = [].concat(info, [
        [pdID, pdData],
        [edID, edData],
      ].map(
        function([regionID, regionData]) {
          return getRegionInfoItem(regionID, regionData);
        }
      ));
    }

    return (
      <Infobox
        title={renderLatLng(this.props.latLng)}
        subTitle="Location"
        info={info}
        style={{background: 'rgba(255, 240, 240, 0.8)'}}
      />
    );
  }
}
