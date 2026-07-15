import React from 'react'
import restAtEnd from '../../assets/rest_at_the_end.jpg'

function Left() {


    const [isHover, setisHover] = React.useState(false)
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })


    const handleMouseMove = (e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect()

        setMousePos({ x: e.clientX - left, y: e.clientY - top })

    }



    return (


        <div className='w-7/12 h-full bg-gray-400 overflow-hidden relative flex justify-center items-center ' onMouseEnter={() => setisHover(true)} onMouseLeave={() => setisHover(false)} onMouseMove={handleMouseMove}>



            {/* Background Image  */}

            <img src={restAtEnd} alt="FIne Grain Image " className='w-full h-full absolute object-cover mix-blend-luminosity brightness-70 inset-0 contrast-125 pointer-events-none' />

            {/* overlay layers */}
            <div className='z-10 absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-transparent'></div>
            <div className='z-10 absolute inset-0 bg-gradient-to-l from-neutral-950/60 to-transparent'></div>

            {/* Spotlight  */}

            <div className='absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ' style={{
                opacity: isHover ? 1 : 0,
                background: `
                                        radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px,
                                                          rgba(255,255,255,0.04) 0%,
                                                             transparent 85%),
            
                                        radial-gradient(300px circle at ${mousePos.x + 70}px ${mousePos.y - 40}px,
                                                         rgba(255,255,255,.02) 0%,
                                                               transparent 70%),
            
                                        radial-gradient(300px circle at ${mousePos.x - 60}px ${mousePos.y + 60}px,
                                                          rgba(255,255,255,.03) 0%,
                                                           transparent 70%)
              `
            }} >

            </div>


            {/* Quote*/}

            <div className='z-30 max-w-2xl mx-auto text-center px-4 '>


                <p className='text-gray-200 font-[Instrument_Serif] font-light italic leading-tight text-[clamp(1.75rem,3.5vw,3.25rem)] ' >"The key is in not spending time, but in investing it"</p>
                <div className='w-12 h-[2px] bg-gray-800 mx-auto my-6 bg-linear-to-r from-white to-amber-400' ></div>
                <p className='text-xs font-bold uppercase tracking-widest text-amber-400  font-sans'>Timotive Workspace</p>
            </div>









        </div>



    )

}

export default Left 