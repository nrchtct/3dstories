import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ScrollControls, useScroll } from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import { editable as e, SheetProvider, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'
import SpotLightWithHelper from '../SpotLightWithHelper'
import { useAtom } from 'jotai'
import { currentPageAtom, currentSceneAtom, watchLoadedAtom } from '../GlobalState'
import Feature from '../Ui/Feature'
import { useEffect, useState } from 'react'
import Button from '../Ui/Button'

import knightAni from '../Data/knightAni.json'
import Blouson from '../modelComps/Blouson'

const BlousonPage = () => {
  // const [scene1, setScene1] = useAtom(scene1Atom)
  const [currentScene] = useAtom(currentSceneAtom)
  const [watchLoaded] = useAtom(watchLoadedAtom)

  useEffect(() => {
    console.log('Watch Model Load State')
  }, [watchLoaded])

  const shouldAnimateScene1 = currentScene === 1
  const shouldAnimateScene2 = currentScene === 3
  const shouldAnimateScene3 = currentScene === 4
  const shouldAnimateScene4 = currentScene === 5

  //Hide the flashing div at the beginning after the page loaded
  const [hiddenState, setHiddenState] = useState('hidden')

  useEffect(() => {
    if (shouldAnimateScene2) {
      setHiddenState('')
    }
  }, [shouldAnimateScene2])

  //Use JSON file to trigger the animation
  // const sheet = getProject('Model Animation').sheet('Scene')

  //Rerurn Theatre JS animation properties
  const sheet = getProject('Model Animation', { state: knightAni }).sheet('Scene')

  return (
    <Canvas gl={{ physicallyCorrectLights: true, preserveDrawingBuffer: true }}>
      <ScrollControls pages={3} distance={3} maxSpeed={1} damping={1}>
        <SheetProvider sheet={sheet}>
          <Scene />
        </SheetProvider>
      </ScrollControls>
    </Canvas>
  )
}

export default BlousonPage

const Scene = () => {
  const sheet = useCurrentSheet()
  const scroll = useScroll()

  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  // const [scene1, setScene1] = useAtom(scene1Atom)
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom)

  const sequenceLength = val(sheet.sequence.pointer.length)

  function logCurrentPageCallback(scroll, callback) {
    const currentPage = Math.floor(scroll.offset * scroll.pages) + 1

    // Determine the current scene on how far into the page you've scrolled
    const positionWithinPage = (scroll.offset * scroll.pages) % 1

    // **** THE * 2 is the multiple of which the pages is split - thus for more scenes multiple with larger numbers
    const sceneOffsetForCurrentPage = Math.floor(positionWithinPage * 2) + 1

    // Calculate the total scenes from all previous pages + scences from the current page

    const computedScene = (currentPage - 1) * 2 + sceneOffsetForCurrentPage

    console.log('Current Page', currentPage)
    console.log('Current Scene', currentScene)
    callback(currentPage)
    setCurrentScene(computedScene)
  }

  useFrame(() => {
    if (scroll) {
      logCurrentPageCallback(scroll, setCurrentPage)
      sheet.sequence.position = scroll.offset * sequenceLength
    }
  })

  useEffect(() => {
    console.log('Current Scene:', currentScene)
  }, [currentScene])

  return (
    <>
      {/* <color attach='background' args={['#333333']} /> */}
      <Environment preset='dawn' />
      <PerspectiveCamera theatreKey='Camera' makeDefault position={[0, 0, 0]} fov={90} near={0.1} far={70} />
      <SpotLightWithHelper theatreKey='Spot Light 1' position={[0, 0, 0]} intensity={1} showHelper={false} />
      <SpotLightWithHelper theatreKey='Spot Light 2' position={[0, 0, 0]} intensity={1} showHelper={false} />

      <Blouson />
    </>
  )
}