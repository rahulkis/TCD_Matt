import React from "react";
import ProfileServicesLayout from "./profiles.services";
import ObjectivesServicesLayout from "./objectives.services";
import CategoryServicesLayout from "./category.services";
import RatingReviewsServicesLayout from "./ratingsreviews.services";
const ProfileServices = (activeContent) => {
    return (
        <ProfileServicesLayout activeContentTab={activeContent}/>
    );
}

const ObjectivesServices = (activeContent) => {
    return (
        <ObjectivesServicesLayout activeContentTab={activeContent}/>
    );
}

const CategoryServices = (activeContent) => {
    return (
        <CategoryServicesLayout activeContentTab={activeContent}/>
    );
}

const RatingReviewsServices = (activeContent) => {
    return (
        <RatingReviewsServicesLayout activeContentTab={activeContent}/>
    );
}
export {ProfileServices, ObjectivesServices, CategoryServices, RatingReviewsServices};