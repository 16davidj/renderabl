window.React = React;
(function () {
    function SampleAgentCard({ picture_url, name, summary }) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "sample-agent-card"
        }, /*#__PURE__*/ React.createElement("img", {
            src: picture_url,
            alt: name,
            className: "sample-agent-card__image"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "sample-agent-card__content"
        }, /*#__PURE__*/ React.createElement("h2", {
            className: "sample-agent-card__name"
        }, name), /*#__PURE__*/ React.createElement("p", {
            className: "sample-agent-card__summary"
        }, summary)));
    }
    return SampleAgentCard;
})();
//# sourceMappingURL=test.js.map