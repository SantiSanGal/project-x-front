import './styles/pageAbout.css'

export const PageAbout = () => {
  return (
    <div className="page">
      <div className="pageMainContent">
        <div className="descriptionContainer">
          <h2>How's this work?</h2>
          <p>
            On the canvas, select the area where you want to paint, choosing ranges of 25 pixels at a time. Once you've selected the location, you can proceed with the donation. After completing the payment, you'll be able to paint the colors you want on the chosen pixels.
          </p>
          <h2>Why am I doing this?</h2>
          <p>
            These years hold a special place in my heart as my mother will be turning 50, my father will be turning 60, and they will both be celebrating their 30th wedding anniversary.
            I love my parents deeply, which is why I want to give them gifts that will make their dreams come true. I want to buy my mother a house and take my father to his first World Cup. So here I am, working hard to make these dreams a reality.
            <br />
            <br />
            <p style={{ color: 'gray' }}> SNGM - from Paraguay</p>
          </p>
        </div>
      </div>
    </div>
  )
}