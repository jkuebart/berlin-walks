import React from 'react';
import { Map, Polyline, TileLayer } from 'react-leaflet';
import _ from 'lodash';

const POSITION = [52.45, 13.30];
const TILE_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
const TILE_ATTRIBUTION =
  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
  ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
  ' Imagery © <a href="http://mapbox.com">Mapbox</a>';
const ACCESS_TOKEN =
  'pk.eyJ1IjoiY3JlcGVscyIsImEiOiJjaXdheGxpdTcwMDF2MnpvNmNucDhrdnN0In0.WiXElc_RJUWKB_CFqssrBA';
const TILE_ID = 'mapbox.outdoors';


class Walk extends React.Component {
  constructor() {
    super();
    this.state = {
      hover: false
    };
  }
  handleMouseOver() {
    this.setState({ hover: true });
  }
  handleMouseOut() {
    this.setState({ hover: false });
  }
  render() {
    var className = '';
    if (this.state.hover) {
      className += ' hover';
    }
    if (this.props.selected) {
      className += ' selected';
    }
    return (
      <div>
        <Polyline
          className={className}
          positions={this.props.positions} />
        <Polyline
          className='hidden'
          positions={this.props.positions}
          onMouseOver={() => this.handleMouseOver()}
          onMouseOut={() => this.handleMouseOut()}
          onClick={() => this.props.onClick()}
        />
      </div>
    );
  }
}

function distance(walks) {
  return walks.map(function(walk) {
    return walk.distance;
  }).reduce(function(x, y) {
    return x + y;
  }, 0);
}

function WalkDetails(props) {
  if (props.walk == null) {
    return (
      <div className='walk-details empty'>
        <div className='title'>Select a walk</div>
      </div>
    );
  }

  const separator = ' – ';

  const participatsLinks = props.walk.participants.map(participant =>
    <a
      className='participant'
      onClick={() => props.onClickName(participant)}
      key={participant}>
      {participant}
    </a>
  );

  const participantsList = _.range(participatsLinks.length * 2 - 1).map(function(i) {
    return i % 2 === 0 ? participatsLinks[i / 2] : ' • ';
  });

  return (
    <div className='walk-details'>
      <div className='title'>{props.walk.title}</div>
      <div className='info'>
        <span className='date'>{props.walk.date}</span>
        {separator}
        <span className='distance'>{props.walk.distance} km</span>
        {separator}
        <span className='participants'>
          {props.walk.participants.length} walkers
        </span>
      </div>
      <div className='details'>
        {participantsList}
      </div>
    </div>
  );
}

function GlobalInfo(props) {
  const totalDistance = distance(props.walks);
  const totalWalks = props.walks.length;

  return (
    <div className='global-info'>
      <div className='title'>Berlin Walks</div>
      <div className='distance'>{totalDistance} km on {totalWalks} walks</div>
    </div>
  );
}


class WalksMap extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedWalk: null,
      selectedName: null
    };
  }
  selectWalk(walk) {
    this.setState({ selectedWalk: walk });
  }
  selectName(name) {
    this.setState({ selectedName: name });
  }
  render() {
    const walkObjects = this.props.walks.map((walk, i) =>
      <Walk
        positions={walk.path}
        key={i}
        selected={walk.participants.indexOf(this.state.selectedName) >= 0}
        onClick={() => this.selectWalk(walk)}
        />
    );

    return (
      <div>
        <Map id='mapid' center={POSITION} zoom={9}>
          <TileLayer
            url={TILE_URL}
            attribution={TILE_ATTRIBUTION}
            accessToken={ACCESS_TOKEN}
            id={TILE_ID}
          />
          {walkObjects}
        </Map>
        <div id='overlays'>
          <GlobalInfo walks={this.props.walks} />
          <WalkDetails walk={this.state.selectedWalk} onClickName={(name) => this.selectName(name)} />
        </div>
      </div>
    );
  }
}

export default WalksMap;
