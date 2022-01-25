import React, {useContext, useEffect, useState} from 'react';

import {firestore} from '../../Firebase/config'
import {FilesContext} from '../../context/filesContext'

import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import './Home.css'
import ModalGaleria from '../Modales/ModalGaleria';
import { StyledEngineProvider } from '@mui/material/styles';

function Home() {

    const {user, infoUser, setInfoUser, propiedades, setPropiedades} = useContext(FilesContext)
    const [infoPropiedad, setInfoPropiedad] = useState()


    useEffect(() => {
        async function fetchInfoUsuario() {
            let propiedades
            onSnapshot(doc(firestore, "usuarios", user.email), (doc) => {
                propiedades = doc.data()
              })
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
                let datosCasa
                onSnapshot(doc(firestore, "contratos", element), (doc) => {
                    datosCasa = doc.data()
                })
                array.push(datosCasa)
            }
            setInfoPropiedad(array)
        }
        fetchCasas()
    }, [propiedades])
    

    return (
        <>
            <h2>Actualiza las fotos de tu propiedad</h2>
        </>
    ) 
}

export default Home;
