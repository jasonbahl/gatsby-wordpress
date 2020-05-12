import React from "react"
import styled from 'styled-components'
import { colors, mixins, sizes, breakpoints, fonts } from '../css-variables'
import CardD from './CardD'

const ContentCardD = ({ className, date, title, category, venue, location, excerpt, url, urlText })=> {

    const moreLinkText = urlText ? urlText : 'Read More'
    return (
        <CardD>
            <div className={className}>
            <div className={`${className}__wrapper`}>
                { date && (
                    <div className={`${className}__date`}>{date}</div>
                )}
                <div className={`${className}__titlesection`}>
                    { title && (
                        <h3 className={`${className}__title`}>{title}</h3>
                    )}
                    { category && (
                        <div className={`${className}__category`}>{category}</div>
                    )}
                </div>
                { venue && (
                    <div className={`${className}__venue`}>{venue}</div>
                )}
                { location && (
                    <div className={`${className}__location`}>{location}</div>
                )}
                { excerpt && (
                    <div className={`${className}__excerpt`}>
                        {excerpt}
                        { url && (
                            <a href={url}>{urlText}</a>
                        )}
                    </div>
                )}
                </div>
                
            </div>
        </CardD>
    )
}
const StyledContentCardD = styled(ContentCardD)`
padding: 1rem;
background-color: ${colors.bgWhite};
min-height: 256px;
width: 100%;

@media screen and ${breakpoints.tabletS} {
    padding: 1.778rem;
    min-height: 344px;

}

&_wrapper {
    position: relative;
}


&__date {
    font-family: ${fonts.eaves};
    font-weight: bold;
    font-size: ${sizes.s32};
    font-style: italic;
    color: ${colors.dateColor};
    margin-bottom: 0.888rem;
    @media screen and ${breakpoints.tabletS} {
        font-size: ${sizes.s32};
        margin-bottom: 1.334rem;
    }
}
&__titlesection {
    position: relative; 
    margin-bottom: .667rem;
    padding-bottom: .889px;
    @media screen and ${breakpoints.tabletS} {
        margin-bottom: 1rem;
        padding-bottom: 1.223rem;    }
    &:after {
        position: absolute; 
        bottom: 0;
        left: 0;
        width: 1.889rem;
        height: .222rem;
        background-color: ${colors.titleColor};
        content: '';
    }
}
&__title {
    ${mixins.cardTitle}
    font-size: ${sizes.s20};
    margin-bottom: .667rem;
    @media screen and ${breakpoints.tabletS} {
        font-size: ${sizes.s24};
        margin-bottom: 1rem;
    }
}
&__category {
    font-size: ${sizes.s14};
    font-weight: 800;
    text-transform: uppercase;
    color: ${colors.categoryGrey};
    @media screen and ${breakpoints.tabletS} {
        font-size: 0.778rem;
    }
}
&__venue {
}
&__location {
    font-weight: bold;
}
`

export default StyledContentCardD