odoo.define('website_slides.slide.archive', function (require) {
'use strict';

var sAnimations = require('website.content.snippets.animation');
var Dialog = require('web.Dialog');
var core = require('web.core');
var _t = core._t;

var SlideArchiveDialog = Dialog.extend({
    template: 'slides.slide.archive',

    /**
     * @override
     */
    init: function (parent, options) {
        options = _.defaults(options || {}, {
            title: _t('Archive Slide'),
            size: 'medium',
            buttons: [{
                text: _t('Archive'),
                classes: 'btn-primary',
                click: this._onClickArchive.bind(this)
            }, {
                text: _t('Cancel'),
                close: true
            }]
        });

        this.$slideTarget = options.slideTarget;
        this.slideId = this.$slideTarget.attr('slide_id');
        this._super(parent, options);
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Calls 'archive' on slide controller and then visually removes the slide dom element
     */
    _onClickArchive: function () {
        var self = this;

        this._rpc({
            route: '/slides/slide/archive',
            params: {
                slide_id: this.slideId
            },
        }).then(function () {
            self.$slideTarget.closest('.o_wslides_content_slide').remove();
            self.close();
        });
    }
});

sAnimations.registry.websiteSlidesSlideArchive = sAnimations.Class.extend({
    selector: '.o_wslides_js_slide_archive',
    xmlDependencies: ['/website_slides/static/src/xml/slide_management.xml'],
    read_events: {
        'click': '_onArchiveSlideClick',
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    _openDialog: function ($slideTarget) {
        new SlideArchiveDialog(this, {slideTarget: $slideTarget}).open();
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} ev
     */
    _onArchiveSlideClick: function (ev) {
        ev.preventDefault();
        var $slideTarget = $(ev.currentTarget);
        this._openDialog($slideTarget);
    },
});

return {
    slideArchiveDialog: SlideArchiveDialog,
    websiteSlidesSlideArchive: sAnimations.registry.websiteSlidesSlideArchive
};

});
