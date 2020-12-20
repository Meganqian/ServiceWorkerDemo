
define(function (require) {
    'use strict';
    // function render(data){
    //     let html = data.subjects.map(function (subject) {
    //         return `
    //         <li>
    //             <img src="${subject.images.medium}"/>
    //             <p>${subject.title}</p>
    //         </li>
    //         `;
    //     }).join('');
    //     return html;
    // };
    return function (data) {
        let html = data.subjects.map(function (subject) {
            return `
            <li>
                <img src="${subject.images.medium}"/>
                <p>${subject.title}</p>
            </li>
            `;
        }).join('');
        return html;
    };
});

// export default render;
