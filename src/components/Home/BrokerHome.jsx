import * as React from 'react';
import {useContext, useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Home from './Home'
import './BrokerHome.css'
import MediaControlCard from './Cards';
import SearchContract from '../../components/SearchContract/SearchContract';
import { useNavigate } from "react-router-dom";
import { FilesContext } from '../../context/filesContext'
import sinFotoFachada from '../../Assets/no-propertyfound.png'

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {

  const {infoUser, getInfo} = useContext(FilesContext)
  const [value, setValue] = useState(0);
  const [propiedadesRentadas, setPropiedadesRentadas] = useState([])
  const [propiedadesEnProceso, setPropiedadesEnProceso] = useState([])
  const [propiedadesRentadasInfo, setPropiedadesRentadasInfo] = useState([])
  const [propiedadesEnProcesoInfo, setPropiedadesEnProcesoInfo] = useState([])
  const [propiedadesRentadasRenderizar, setPropiedadesRentadasRenderizar] = useState([])
  const [propiedadesEnProcesoRenderizar, setPropiedadesEnProcesoRenderizar] = useState([])


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const goToStepper = () => {
    navigate("/section");
  }

  useEffect(() => {
    setPropiedadesRentadas(infoUser?.propiedades_rentadas)
    setPropiedadesEnProceso(infoUser?.propiedades_en_proceso)
  }, [infoUser]);

  useEffect(() => {
    async function fetchPropiedades (propiedades, setPropiedades) {
      let arrayRentadas = []
      for (let index = 0; index < propiedades?.length; index++) {
        const element = propiedades[index];
        const propiedadesFetch = await getInfo("contratos", element)
        arrayRentadas.push(propiedadesFetch)
      }
      setPropiedades(arrayRentadas)

    }
    fetchPropiedades(propiedadesRentadas, setPropiedadesRentadasInfo)
    fetchPropiedades(propiedadesEnProceso, setPropiedadesEnProcesoInfo)

  },[getInfo, propiedadesRentadas, propiedadesEnProceso])


  useEffect(() => {
    function setearRenderizado(objeto, setObjeto) {
      let arrayObjetosRenderizar = []
  
      for (let i = 0; i < objeto.length; i++) {
        const element = objeto[i]; //objeto
        arrayObjetosRenderizar.push({
          alias_casa: element.alias_casa,
          numero_contrato: element.numero_contrato,
          foto_fachada: element.fotos_fachada ? 
                        element.fotos_fachada.fotos[0] :
                        ""
        })
      }
      setObjeto(arrayObjetosRenderizar) 
    }
    
    setearRenderizado(propiedadesRentadasInfo, setPropiedadesRentadasRenderizar)
    setearRenderizado(propiedadesEnProcesoInfo, setPropiedadesEnProcesoRenderizar)
  }, [propiedadesEnProcesoInfo, propiedadesRentadasInfo]);

  

 
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="ya">
          <Tab label="Añadir" {...a11yProps(0)} />
          <Tab label="En proceso" {...a11yProps(1)} />
          <Tab label="Historial" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Home/>
        <button color="primary" className="goToNew"
                onClick={goToStepper}>Añadir fotos</button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Home/>
        <div>
          {propiedadesRentadasRenderizar.map(propiedad => {
            console.log(propiedad)
            return(
              <MediaControlCard key={crypto.randomUUID()} numero_contrato={propiedad.numero_contrato} alias_casa={propiedad.alias_casa} foto_fachada={propiedad.foto_fachada === "" ? sinFotoFachada : propiedad.foto_fachada}/>
            )
          })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <div>
          {propiedadesEnProcesoRenderizar.map(propiedad => {
            console.log(propiedad)
            return(
              <MediaControlCard key={crypto.randomUUID()} numero_contrato={propiedad.numero_contrato} alias_casa={propiedad.alias_casa} foto_fachada={propiedad.foto_fachada === "" ? sinFotoFachada : propiedad.foto_fachada}/>
            )
          })}
        </div>
      </TabPanel>
    </Box>
  );
}