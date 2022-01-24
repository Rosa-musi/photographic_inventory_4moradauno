import React, {useContext, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { FilesContext } from "../../context/filesContext";
import ImgUp from "../UploadFiles/ImgUp";
import {updateDoc, doc} from 'firebase/firestore'
import {firestore} from '../../Firebase/config'

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


export default function RenderArchives() {
   
  const { 
  /*   infoSeccion, 
    setInfoSeccion,  */
    infoPropiedad,
    setInfoPropiedad,
    propiedadQueSubeFotos,
    getInfo 
  } = useContext(FilesContext)

  const [value, setValue] = React.useState(0);
  const [infoSeccion, setInfoseccion] = React.useState();


  const secciones = ["fotos_fachada", "fotos_recamara", "fotos_baño", "fotos_cocina", "fotos_sala", "fotos_otros"]

  
 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //setear aquí la información para que se renderice lo nuevo
 useEffect(() => {
    async function actualizarDatosPropiedad(){
      const actualizar = await getInfo("contratos", propiedadQueSubeFotos)
      setInfoPropiedad(actualizar)
    }
    actualizarDatosPropiedad()
  }, []);   



    useEffect(() => {

    let arraysecciones = []
    for (let index = 0; index < secciones.length; index++) {
      const element = secciones[index];
      Object.entries(infoPropiedad).forEach(([key, value]) => {
        if(key === element){
          arraysecciones.push({
            [element]: value
          })
        }
      })
    }
        
    setInfoseccion(arraysecciones) 
  }, []);  


  async function handleAceptar (){
    const docuRef = doc(firestore, `contratos/${propiedadQueSubeFotos}`)
    await updateDoc(docuRef, {
      estatus: "aprobado para firma"
    })
  }
 /*  async function añadirFotosApropiedad(e){
    e.preventDefault()
    if(seccion === undefined){
        alert("elije una sección de la casa") 
    }
    const descripcion = e.target.placeComent.value
    const nuevoArrayPropiedad = 
        {
            ...infoPropiedad,
            [fotosNombre]: {
                comentarios: descripcion ? descripcion : "",
                fotos: urlDescarga ? urlDescarga : [],
                seccion: seccion
            }
        }
    
  if(seccion === undefined){
      alert("no hay información para guardar en esta sección")
  } else {
      const docuRef = doc(firestore, `contratos/${propiedadQueSubeFotos}`)
      await updateDoc(docuRef, nuevoArrayPropiedad)
      e.target.placeComent.value = ""
  }

} */
 
  return (
    <>
    <h1>Categorias</h1>
    <div>
      <h2>Por favor, verifica que estás feliz con las fotos que subiste</h2>
      <p>En caso de que necesites borrar alguna, vuelve al paso anterior</p>
    </div> 
    <div>
      {
        infoSeccion?.map((element) => {
          return( //todas las secciones
            Object.entries(element).map(([key, value]) => {
              const fotos = value.fotos
              return( //values de cada sección
                <>
                  <p key={crypto.randomUUID()}>{value.seccion}</p>
                  <p key={crypto.randomUUID()}>{value.comentarios}</p>
                  <div key={crypto.randomUUID()} style={{display: "flex", flexWrap: "wrap"}}>
                  {
                    fotos.map((url, i) => {
                      return(
                        <img key={crypto.randomUUID()} src={url} alt={`foto`} style={{width: "100px"}} />
                      )
                    })
                  }
                  </div>
                </>
              )
            })
          )
        })
      }
    </div>
    <div>
      <p>¿Aceptas las fotografias de la propiedad?</p>
      <button onclick={handleAceptar}>Aceptar</button>
    </div>
    <Box sx={{ width: "100%" }}>
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Asesor@ Inmobiliario" {...a11yProps(0)} />
        <Tab label="Inquilin@" {...a11yProps(1)} />
      </Tabs>
    </Box>
    <TabPanel value={value} index={0}>
      <ImgUp />
    </TabPanel>
    <TabPanel value={value} index={1}>
      <ImgUp />
    </TabPanel>
  </Box>
    </>
  );
}