import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ExchangeRate() {
  const now = format(new Date(), "yyyy-MM-dd");
  const [symbols, setSymbols] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(now);
  const [selectedEndDate, setSelectedEndDate] = useState(now);
  const [selectedBase, setSelectedBase] = useState();
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState();
  const [selectedPlaces, setSelectedPlaces] = useState();
  const [selectedFormat, setSelectedFormat] = useState();
  const [selectedSource, setSelectedSource] = useState();
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [downloadData, setDownloadData] = useState();

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => `${option?.code} ${option?.description}`,
  });
  const filterSourceOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => `${option?.source} ${option?.description}`,
  });

  const handleChangeStartDate = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStartDate(value);
  };
  const handleChangeEndDate = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedEndDate(value);
  };

  const handleChangeBase = (event, value) => {
    setSelectedBase(value);
  };
  const handleChangeSymbol = (event, value) => {
    setSelectedSymbols(value);
  };
  const handleChangeAmount = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAmount(value);
  };
  const handleClearAmount = (event) => {
    setSelectedAmount("");
  };
  const handleChangePlaces = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPlaces(value);
  };
  const handleClearPlaces = (event) => {
    setSelectedPlaces("");
  };
  const handleChangeFormat = (event, value) => {
    setSelectedFormat(value);
  };
  const handleChangeSource = (event, value) => {
    setSelectedSource(value);
  };

  const handleGetData = () => {
    const params = {
      start_date: selectedStartDate || "",
      end_date: selectedEndDate || "",
      base: selectedBase?.code || "",
      symbols: selectedSymbols
        ? selectedSymbols.map(({ code }) => code).join(",")
        : "",
      amount: selectedAmount || "",
      places: selectedPlaces || "",
      format: selectedFormat || "",
      source: selectedSource?.source || "",
    };
    const url = "https://api.exchangerate.host/timeseries";
    const ext = selectedFormat ? selectedFormat : "json";
    const downloadUrl = `${url}?${new URLSearchParams(params).toString()}`;
    setDownloadUrls([downloadUrl]);
    axios.get(url, { params }).then((data) => {
      if (ext === "json") {
        setDownloadData(JSON.stringify(data.data, null, 2));
      } else {
        setDownloadData(data.data);
      }
    });
  };

  /*
  const handleRun = () => {
    const params = {
      start_date: selectedStartDate || "",
      end_date: selectedEndDate || "",
      base: selectedBase?.code || "",
      symbols: selectedSymbols
        ? selectedSymbols.map(({ code }) => code).join(",")
        : "",
      amount: selectedAmount || "",
      places: selectedPlaces || "",
      format: selectedFormat || "",
      source: selectedSource?.source || "",
    };
    const ext = selectedFormat ? selectedFormat : "json";
    const url = "https://api.exchangerate.host/timeseries";
    const method = "GET";
    const downloadUrl = `${url}?${new URLSearchParams(params).toString()}`;
    setDownloadUrls([downloadUrl]);

    axios
      .request({
        url,
        method,
        responseType: "blob",
        params,
      })
      .then(({ data }) => {
        const objectUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = objectUrl;
        link.setAttribute("download", `exchange_rate.${ext}`); //any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  */

  useEffect(() => {
    axios.get("https://api.exchangerate.host/symbols").then(({ data }) => {
      setSymbols(Object.values(data.symbols));
    });
    axios
      .all([
        axios.get("https://api.exchangerate.host/sources"),
        axios.get("https://api.exchangerate.host/cryptocurrencies"),
      ])
      .then(
        axios.spread((d1, d2) => {
          const l1 = Object.values(d1.data.sources).map(
            ({ source, name, available_from_date }) => {
              return {
                group: "sources",
                source: source,
                description: name,
                available_from_date: available_from_date,
              };
            }
          );
          const l2 = Object.values(d2.data.cryptocurrencies).map(
            ({ symbol, name }) => {
              return {
                group: "cryptocurrencies",
                source: symbol.toLowerCase(),
                description: name,
              };
            }
          );
          setSources([...l1, ...l2]);
        })
      );
  }, []);

  return (
    <div style={{ padding: 5 }}>
      <h1>ExchangeRate</h1>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <TextField
            id="end_date"
            label="Start Date"
            type="date"
            defaultValue={now}
            onChange={handleChangeStartDate}
            size="small"
            sx={{ width: "100%" }}
            inputProps={{ style: { paddingLeft: 5 } }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="start_date"
            label="End Date"
            type="date"
            defaultValue={now}
            onChange={handleChangeEndDate}
            size="small"
            sx={{ width: "100%" }}
            inputProps={{ style: { paddingLeft: 5 } }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            // multiple
            // id="checkboxes-tags-demo"
            onChange={handleChangeFormat}
            size="small"
            options={["xml", "csv", "tsv"]}
            // disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props} style={{ paddingTop: 0, paddingBottom: 0 }}>
                {option}
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Format" placeholder="Format" />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          {symbols && (
            <Autocomplete
              // multiple
              // id="checkboxes-tags-demo"
              onChange={handleChangeBase}
              size="small"
              options={symbols}
              // disableCloseOnSelect
              getOptionLabel={(option) => option.code}
              filterOptions={filterOptions}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  {option.code} - {option.description}
                </li>
              )}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Base" placeholder="Base" />
              )}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          {symbols && (
            <Autocomplete
              multiple
              // id="checkboxes-tags-demo"
              onChange={handleChangeSymbol}
              size="small"
              options={symbols}
              disableCloseOnSelect
              getOptionLabel={(option) => option.code}
              filterOptions={filterOptions}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8, paddingTop: 0, paddingBottom: 0 }}
                    checked={selected}
                  />
                  {option.code} - {option.description}
                </li>
              )}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Symbols" placeholder="Symbols" />
              )}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            variant="outlined"
            size="small"
            value={selectedAmount}
            onChange={handleChangeAmount}
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ visibility: selectedAmount ? "visible" : "hidden" }}
                  onClick={handleClearAmount}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Places"
            variant="outlined"
            size="small"
            value={selectedPlaces}
            onChange={handleChangePlaces}
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ visibility: selectedPlaces ? "visible" : "hidden" }}
                  onClick={handleClearPlaces}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {sources && (
            <Autocomplete
              // multiple
              // id="checkboxes-tags-demo"
              onChange={handleChangeSource}
              size="small"
              style={{ width: "100%" }}
              options={sources}
              groupBy={(option) => option.group}
              // disableCloseOnSelect
              getOptionLabel={(option) => option.source}
              filterOptions={filterSourceOptions}
              renderOption={(props, option, { selected }) => (
                <li {...props} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  {option.source} - {option.description}{" "}
                  {option?.available_from_date
                    ? `(${option?.available_from_date}~)`
                    : null}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Source" placeholder="Source" />
              )}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex" }}>
            <Button variant="contained" onClick={handleGetData} size="small">
              Get Data
            </Button>
            {/* <Divider
              orientation="vertical"
              variant="middle"
              sx={{ margin: 0.5 }}
              flexItem
            />
            <Button variant="contained" onClick={handleRun} size="small">
              Download
            </Button> */}
          </Box>
        </Grid>
        {downloadData && (
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="Exchange Rate"
              multiline
              rows={10}
              sx={{ width: "100%" }}
              value={downloadData}
              // defaultValue=""
            />
          </Grid>
        )}
        {downloadUrls &&
          downloadUrls.map((link) => (
            <Grid item xs={12} key={link}>
              <Link href={link} target="_blank" download>
                {link}
              </Link>
            </Grid>
          ))}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Link href="https://exchangerate.host/#/docs" target="_blank">
            https://exchangerate.host/#/docs
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Link href="https://api.exchangerate.host/symbols" target="_blank">
            https://api.exchangerate.host/symbols
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Link href="https://api.exchangerate.host/sources" target="_blank">
            https://api.exchangerate.host/sources
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Link
            href="https://api.exchangerate.host/cryptocurrencies"
            target="_blank"
          >
            https://api.exchangerate.host/cryptocurrencies
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default ExchangeRate;
