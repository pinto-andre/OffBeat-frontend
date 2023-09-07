import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/* Material UI imports */
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const API_URL = "http://localhost:5005";

function BandList(props) {
  const [bands, setBands] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isListSwitched, setIsListSwitched] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredBands, setFilteredBands] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);

  const handleSearch = () => {
    // Set the searchQuery state
    setSearchQuery(searchQuery);

    // Navigate to the /bands route with the searchQuery as a URL parameter
    navigate(`/bands?search=${searchQuery}`);
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/bands`)
      .then((response) => {
        setBands(response.data), setFilteredBands(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/artists`)
      .then((response) => {
        setArtists(response.data), setFilteredArtists(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (props.searched) {
      const filteredBands = bands.filter((band) => {
        const name = band.name || '';
        const genres = Array.isArray(band.genres) ? band.genres.join(' ') : band.genres || '';
        const missing = Array.isArray(band.missing) ? band.missing.join(' ') : band.missing || '';
  
        if (typeof name !== 'string') {
          console.error(`Invalid name: ${name}`);
        }
  
        if (typeof genres !== 'string') {
          console.error(`Invalid genres: ${genres}`);
        }
  
        if (typeof missing !== 'string') {
          console.error(`Invalid missing: ${missing}`);
        }
  
        return (
          name.toLowerCase().includes(props.searched.toLowerCase()) ||
          genres.toLowerCase().includes(props.searched.toLowerCase()) ||
          missing.toLowerCase().includes(props.searched.toLowerCase())
        );
      });
  
      const filteredArtists = artists.filter((artist) => {
        const firstName = artist.firstName || '';
        const lastName = artist.lastName || '';
        const instruments = Array.isArray(artist.instruments) ? artist.instruments.join(' ') : artist.instruments || '';
        const username = artist.username || '';
        const country = artist.country || '';
  
        if (typeof firstName !== 'string') {
          console.error(`Invalid firstName: ${firstName}`);
        }
  
        if (typeof lastName !== 'string') {
          console.error(`Invalid lastName: ${lastName}`);
        }
  
        if (typeof instruments !== 'string') {
          console.error(`Invalid instruments: ${instruments}`);
        }
  
        if (typeof username !== 'string') {
          console.error(`Invalid username: ${username}`);
        }
  
        if (typeof country !== 'string') {
          console.error(`Invalid country: ${country}`);
        }
  
        return (
          firstName.toLowerCase().includes(props.searched.toLowerCase()) ||
          lastName.toLowerCase().includes(props.searched.toLowerCase()) ||
          instruments.toLowerCase().includes(props.searched.toLowerCase()) ||
          username.toLowerCase().includes(props.searched.toLowerCase()) ||
          country.toLowerCase().includes(props.searched.toLowerCase())
        );
      });
  
      setFilteredBands(filteredBands);
      setFilteredArtists(filteredArtists);
    } else {
      // If searchQuery is empty, display all bands
      setFilteredBands(bands);
      setFilteredArtists(artists);
    }
  }, [props.searched]);

  const handleSwitchChange = () => {
    setIsListSwitched(!isListSwitched);
  };

  return (
    <div className="list-container" style={{ paddingTop: "72px" }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={isListSwitched} onChange={handleSwitchChange} />
          }
          label="Switch List"
          labelPlacement="start"
        />
      </FormGroup>
      <Link to="/bands/create">Form a Band</Link>
      {isListSwitched ? (
        <List sx={{ width: "100%", maxWidth: 360 }}>
          <div className="list-artists">
            {filteredArtists.map((artist) => (
              <div key={artist._id}>
                <ListItemButton
                  component="a"
                  href={`/profile/${artist._id}`}
                  alignItems="flex-start"
                >
                  <Divider
                    variant="inset"
                    component="li"
                    sx={{ bgcolor: "white" }}
                  />
                  <ListItemAvatar>
                    <Avatar
                      alt="Avatar"
                      src={artist.img}
                      sx={{ width: "100px", height: "100px" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${artist.firstName} ${artist.lastName}`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="white"
                        >
                          {artist.instruments.map((instrument) => (
                            <React.Fragment key={instrument}>
                              {instrument}
                            </React.Fragment>
                          ))}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItemButton>
                <Divider
                  variant="inset"
                  component="li"
                  sx={{ bgcolor: "white" }}
                />
              </div>
            ))}
          </div>
        </List>
      ) : (
        <div className="list">
          {filteredBands.map((band) => (
            <div key={band._id}>
              <Card sx={{ width: 900, mb: 20 }}>
                <CardActionArea component={Link} to={`/bands/${band._id}`}>
                  <CardMedia
                    component="img"
                    height="500"
                    image={band.img}
                    alt="band image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {band.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {band.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BandList;
