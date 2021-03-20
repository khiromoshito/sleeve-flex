
function R(mobile, tablet, desktop, scaling = true) {
    return SleeveFlex.evaluateResponsiveValue(
        {mobile: mobile,
        tablet: tablet,
        desktop: desktop,
        scaling: scaling});
}



var Device = {
    mobile: 1,
    tablet: 2,
    desktop: 3,

    stringOf: (device_id) => {
        switch(device_id) {
            case Device.mobile:
                return "mobile";
            case Device.tablet:
                return "tablet";
            case Device.desktop:
                return "desktop";
            default:
                return "unknown";
        }
    }
}


var SleeveFlex = {
    idcounter: 0,

    _responsive_elements: [],

    loadResponsiveElements: () => {
        let responsive_elements = document.querySelectorAll("[responsive]");
        responsive_elements.forEach(el=>{
            let responsive_element = new ResponsiveElement(el);
            responsive_element.parse();
            SleeveFlex._responsive_elements.push(responsive_element);
        });
    },

    updateResponsives: () => {
        SleeveFlex._responsive_elements.forEach(responsive=>responsive.parse());
    },

    bounds: {
        mobile: [0, 490],
        tablet: [490, 1007],
        desktop: [1008, Infinity]
    },

    scaleValues: {
        mobile: 1,
        desktop: 1,
        tablet: 1
    },

    regularScreenWidths: {
        mobile: 480,
        tablet: 720,
        desktop: 1200
    },


    device: Device.desktop,
    
    getDeviceString: () => Device.stringOf(SleeveFlex.device),

    scale_ratio: 1,

    sizes: {
        navbar: 55,
        sidebar: 300
    },

    updateScale: () => {
        let screen_width = Math.floor(Math.max(
            document.documentElement.clientWidth,
            window.innerWidth) / window.devicePixelRatio);

        let temp_scale;
        let temp_reg;
        let temp_device;
        if(screen_width >= SleeveFlex.bounds.mobile[0] &&
            screen_width <= SleeveFlex.bounds.mobile[1]) {
            temp_device = Device.mobile;
            temp_reg = SleeveFlex.regularScreenWidths.mobile;
        } else if(screen_width >= SleeveFlex.bounds.tablet[0] &&
            screen_width <= SleeveFlex.bounds.tablet[1]) {
            temp_device = Device.tablet;
            temp_reg = SleeveFlex.regularScreenWidths.tablet;
        } else {
            temp_device = Device.desktop;
            temp_reg = SleeveFlex.regularScreenWidths.desktop;
        }
        //console.log(screen_width);

        let apparent_scale = screen_width/temp_reg;

        SleeveFlex.scale = apparent_scale;
        SleeveFlex.device = temp_device;
        SleeveFlex.updateResponsives();

    },

    evaluateResponsiveValue: (responsive_args) => {
        let current_value;

        switch(SleeveFlex.device) {
            case Device.mobile:
                current_value = responsive_args.mobile;
            break;
            case Device.tablet:
                current_value = responsive_args.tablet;
            break;
            case Device.desktop:
                current_value = responsive_args.desktop;
            break;
        }

        let is_scaling = responsive_args.scaling===undefined ? 
            true : responsive_args.scaling;

        if(typeof(current_value)=="number") {
            if(is_scaling) current_value *= SleeveFlex.scale;
        }

        return current_value;
    },

    Utils: {
        nodeToString: (node) => {
            let temp_parent = document.createElement("div");
            temp_parent.appendChild(node.cloneNode(true));
            return temp_parent.innerHTML;
        },
    
        stringToNode: (nodestring) => {
            let temp_parent = document.createElement("div");
            temp_parent.innerHTML = nodestring;
            return temp_parent.firstChild;
        }
    }

}

    

function ResponsiveElement(element) {
    if(element.hasAttribute("sid")) {
        this.id = element.getAttribute("sid");
    } else {
        this.id = ++SleeveFlex.idcounter;
        element.setAttribute("sid", this.id);
    }

    element.removeAttribute("responsive");

    this.target_element = element;
    this.reference_element = element.cloneNode(true);
  

    this.parse = () => {
        if(!document.body.contains(this.target_element)) {
            this.target_element = document.querySelector(`[sid='${this.id}'`);
        }

        if(!document.body.contains(this.target_element)) {
            console.error("Target element for responsive element was not found");
            return false;
        }

        let node_string = SleeveFlex.Utils.nodeToString(this.reference_element);
        node_string = node_string.replace(/\{\{([^\}]|(?<!\})\})*\}\}/g, m=> {
            return eval(m.slice(2,-2));
        });

        let new_node_parent = document.createElement("html");
        new_node_parent.appendChild(SleeveFlex.Utils.stringToNode(node_string));

        let new_node = new_node_parent.firstElementChild;

        this.target_element.parentElement.replaceChild(new_node, this.target_element);

        this.target_element = new_node;
    }
}





SleeveFlex.scale = SleeveFlex.scaleValues.desktop;


window.addEventListener("resize", ()=>{
    SleeveFlex.updateScale();
});


window.addEventListener("DOMContentLoaded", function(){
    SleeveFlex.updateScale();
    SleeveFlex.loadResponsiveElements();
});



String.prototype.replaceAll = function(match, value) { return this.split(match).join(value)};
Element.prototype.hasClass = function(classname) {
    return this.classList.toString().split(" ").includes(classname);
} 
