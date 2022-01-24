import React, {useContext, useEffect, useState} from 'react';

import {firestore} from '../../Firebase/config'
import {FilesContext} from '../../context/filesContext'

import { doc, getDoc } from 'firebase/firestore'
import './Home.css'
import ModalGaleria from '../Modales/ModalGaleria';
import { StyledEngineProvider } from '@mui/material/styles';


function Home() {

    const {user, infoUser, setInfoUser, propiedades, setPropiedades, getInfo} = useContext(FilesContext)
    const [infoPropiedad, setInfoPropiedad] = useState()


    useEffect(() => {
        async function fetchInfoUsuario() {
            const propiedades = await getInfo("usuarios", user.email)
            setPropiedades(propiedades.propiedades_rentadas)
            setInfoUser(propiedades)
        }
        fetchInfoUsuario()
    }, [])

    useEffect(() => {
        async function fetchCasas(){
            let array = []
            for (let index = 0; index < propiedades?.length; index++) {
                const element = propiedades[index];
                const datosCasa = await getInfo("contratos", element)
                array.push(datosCasa)
            }
            setInfoPropiedad(array)
        }
        fetchCasas()
    }, [propiedades, getInfo])
    

    console.log(infoPropiedad)
    console.log(propiedades)
    console.log(infoUser)
    return (
        <>
            <h2>Actualiza las fotos de tu propiedad</h2>
        </>
    ) 
}

export default Home;
