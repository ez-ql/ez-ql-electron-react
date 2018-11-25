import React from 'react'
import Selector from './Selector/Selector'
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom'

const electron = window.require("electron");
const sharedObject = electron.remote.getGlobal('sharedObj')


const Project1 = () => {

  const selectedSlide = (modelName) => {
  }

  return (
    <div className='Column Flex-wrap'>
      <div>
      <h2>Project 1</h2>
      </div>
      {/* <div className='Row Container Title'>
        <Selector items={sharedObject.currQuery.selectedModelsAndFields} selectedSlide={selectedSlide} />
      </div> */}
      <div>
            <Button
              value="finalize"
              component={Link}
              to="/finalizeQuery"
            >
              Finalize
          </Button>
          </div>
    </div>
  )
}

export default Project1
