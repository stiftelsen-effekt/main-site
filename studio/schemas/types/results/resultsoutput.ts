import { BarChart } from "react-feather";

export default {
  type: "object",
  name: "resultsoutput",
  icon: BarChart,
  fields: [
    {
      type: "string",
      name: "outputType",
      title: "Output Type",
      options: {
        list: [
          "Bednets",
          "Deworming",
          "Cash",
          "Cash zakat",
          "Cash climate fund",
          "Vitamin A",
          "Malaria treatment",
          "Vaccinations",
          "Years of food fortification",
        ],
      },
    },
    {
      type: "array",
      name: "description",
      title: "Description",
      of: [{ type: "block" }],
    },
    {
      type: "array",
      name: "output_countries",
      title: "Output Countries",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Afghanistan", value: "af" },
          { title: "Albania", value: "al" },
          { title: "Algeria", value: "dz" },
          { title: "Andorra", value: "ad" },
          { title: "Angola", value: "ao" },
          { title: "Antigua and Barbuda", value: "ag" },
          { title: "Argentina", value: "ar" },
          { title: "Armenia", value: "am" },
          { title: "Australia", value: "au" },
          { title: "Austria", value: "at" },
          { title: "Azerbaijan", value: "az" },
          { title: "Bahamas", value: "bs" },
          { title: "Bahrain", value: "bh" },
          { title: "Bangladesh", value: "bd" },
          { title: "Barbados", value: "bb" },
          { title: "Belarus", value: "by" },
          { title: "Belgium", value: "be" },
          { title: "Belize", value: "bz" },
          { title: "Benin", value: "bj" },
          { title: "Bhutan", value: "bt" },
          { title: "Bolivia", value: "bo" },
          { title: "Bosnia and Herzegovina", value: "ba" },
          { title: "Botswana", value: "bw" },
          { title: "Brazil", value: "br" },
          { title: "Brunei", value: "bn" },
          { title: "Bulgaria", value: "bg" },
          { title: "Burkina Faso", value: "bf" },
          { title: "Burundi", value: "bi" },
          { title: "Cabo Verde", value: "cv" },
          { title: "Cambodia", value: "kh" },
          { title: "Cameroon", value: "cm" },
          { title: "Canada", value: "ca" },
          { title: "Central African Republic", value: "cf" },
          { title: "Chad", value: "td" },
          { title: "Chile", value: "cl" },
          { title: "China", value: "cn" },
          { title: "Colombia", value: "co" },
          { title: "Comoros", value: "km" },
          { title: "Congo", value: "cg" },
          { title: "Costa Rica", value: "cr" },
          { title: "Côte d'Ivoire", value: "ci" },
          { title: "Croatia", value: "hr" },
          { title: "Cuba", value: "cu" },
          { title: "Cyprus", value: "cy" },
          { title: "Czech Republic", value: "cz" },
          { title: "Denmark", value: "dk" },
          { title: "Democratic Republic of the Congo", value: "cd" },
          { title: "Djibouti", value: "dj" },
          { title: "Dominica", value: "dm" },
          { title: "Dominican Republic", value: "do" },
          { title: "Ecuador", value: "ec" },
          { title: "Egypt", value: "eg" },
          { title: "El Salvador", value: "sv" },
          { title: "Equatorial Guinea", value: "gq" },
          { title: "Eritrea", value: "er" },
          { title: "Estonia", value: "ee" },
          { title: "Eswatini", value: "sz" },
          { title: "Ethiopia", value: "et" },
          { title: "Fiji", value: "fj" },
          { title: "Finland", value: "fi" },
          { title: "France", value: "fr" },
          { title: "Gabon", value: "ga" },
          { title: "Gambia", value: "gm" },
          { title: "Georgia", value: "ge" },
          { title: "Germany", value: "de" },
          { title: "Ghana", value: "gh" },
          { title: "Greece", value: "gr" },
          { title: "Grenada", value: "gd" },
          { title: "Guatemala", value: "gt" },
          { title: "Guinea", value: "gn" },
          { title: "Guinea-Bissau", value: "gw" },
          { title: "Guyana", value: "gy" },
          { title: "Haiti", value: "ht" },
          { title: "Honduras", value: "hn" },
          { title: "Hungary", value: "hu" },
          { title: "Iceland", value: "is" },
          { title: "India", value: "in" },
          { title: "Indonesia", value: "id" },
          { title: "Iran", value: "ir" },
          { title: "Iraq", value: "iq" },
          { title: "Ireland", value: "ie" },
          { title: "Israel", value: "il" },
          { title: "Italy", value: "it" },
          { title: "Jamaica", value: "jm" },
          { title: "Japan", value: "jp" },
          { title: "Jordan", value: "jo" },
          { title: "Kazakhstan", value: "kz" },
          { title: "Kenya", value: "ke" },
          { title: "Kiribati", value: "ki" },
          { title: "Korea, North", value: "kp" },
          { title: "Korea, South", value: "kr" },
          { title: "Kosovo", value: "xk" },
          { title: "Kuwait", value: "kw" },
          { title: "Kyrgyzstan", value: "kg" },
          { title: "Laos", value: "la" },
          { title: "Latvia", value: "lv" },
          { title: "Lebanon", value: "lb" },
          { title: "Lesotho", value: "ls" },
          { title: "Liberia", value: "lr" },
          { title: "Libya", value: "ly" },
          { title: "Liechtenstein", value: "li" },
          { title: "Lithuania", value: "lt" },
          { title: "Luxembourg", value: "lu" },
          { title: "Madagascar", value: "mg" },
          { title: "Malawi", value: "mw" },
          { title: "Malaysia", value: "my" },
          { title: "Maldives", value: "mv" },
          { title: "Mali", value: "ml" },
          { title: "Malta", value: "mt" },
          { title: "Marshall Islands", value: "mh" },
          { title: "Mauritania", value: "mr" },
          { title: "Mauritius", value: "mu" },
          { title: "Mexico", value: "mx" },
          { title: "Micronesia", value: "fm" },
          { title: "Moldova", value: "md" },
          { title: "Monaco", value: "mc" },
          { title: "Mongolia", value: "mn" },
          { title: "Montenegro", value: "me" },
          { title: "Morocco", value: "ma" },
          { title: "Mozambique", value: "mz" },
          { title: "Myanmar", value: "mm" },
          { title: "Namibia", value: "na" },
          { title: "Nauru", value: "nr" },
          { title: "Nepal", value: "np" },
          { title: "Netherlands", value: "nl" },
          { title: "New Zealand", value: "nz" },
          { title: "Nicaragua", value: "ni" },
          { title: "Niger", value: "ne" },
          { title: "Nigeria", value: "ng" },
          { title: "North Macedonia", value: "mk" },
          { title: "Norway", value: "no" },
          { title: "Oman", value: "om" },
          { title: "Pakistan", value: "pk" },
          { title: "Palau", value: "pw" },
          { title: "Panama", value: "pa" },
          { title: "Papua New Guinea", value: "pg" },
          { title: "Paraguay", value: "py" },
          { title: "Peru", value: "pe" },
          { title: "Philippines", value: "ph" },
          { title: "Poland", value: "pl" },
          { title: "Portugal", value: "pt" },
          { title: "Qatar", value: "qa" },
          { title: "Romania", value: "ro" },
          { title: "Russia", value: "ru" },
          { title: "Rwanda", value: "rw" },
          { title: "Saint Kitts and Nevis", value: "kn" },
          { title: "Saint Lucia", value: "lc" },
          { title: "Saint Vincent and the Grenadines", value: "vc" },
          { title: "Samoa", value: "ws" },
          { title: "San Marino", value: "sm" },
          { title: "Sao Tome and Principe", value: "st" },
          { title: "Saudi Arabia", value: "sa" },
          { title: "Senegal", value: "sn" },
          { title: "Serbia", value: "rs" },
          { title: "Seychelles", value: "sc" },
          { title: "Sierra Leone", value: "sl" },
          { title: "Singapore", value: "sg" },
          { title: "Slovakia", value: "sk" },
          { title: "Slovenia", value: "si" },
          { title: "Solomon Islands", value: "sb" },
          { title: "Somalia", value: "so" },
          { title: "South Africa", value: "za" },
          { title: "South Sudan", value: "ss" },
          { title: "Spain", value: "es" },
          { title: "Sri Lanka", value: "lk" },
          { title: "Sudan", value: "sd" },
          { title: "Suriname", value: "sr" },
          { title: "Sweden", value: "se" },
          { title: "Switzerland", value: "ch" },
          { title: "Syria", value: "sy" },
          { title: "Taiwan", value: "tw" },
          { title: "Tajikistan", value: "tj" },
          { title: "Tanzania", value: "tz" },
          { title: "Thailand", value: "th" },
          { title: "Timor-Leste", value: "tl" },
          { title: "Togo", value: "tg" },
          { title: "Tonga", value: "to" },
          { title: "Trinidad and Tobago", value: "tt" },
          { title: "Tunisia", value: "tn" },
          { title: "Turkey", value: "tr" },
          { title: "Turkmenistan", value: "tm" },
          { title: "Tuvalu", value: "tv" },
          { title: "Uganda", value: "ug" },
          { title: "Ukraine", value: "ua" },
          { title: "United Arab Emirates", value: "ae" },
          { title: "United Kingdom", value: "gb" },
          { title: "United States", value: "us" },
          { title: "Uruguay", value: "uy" },
          { title: "Uzbekistan", value: "uz" },
          { title: "Vanuatu", value: "vu" },
          { title: "Vatican City", value: "va" },
          { title: "Venezuela", value: "ve" },
          { title: "Vietnam", value: "vn" },
          { title: "Yemen", value: "ye" },
          { title: "Zambia", value: "zm" },
          { title: "Zimbabwe", value: "zw" },
          { title: "Palestine, State of", value: "ps" },
        ],
        layout: "grid",
      },
    },
    {
      type: "array",
      name: "graph_annotations",
      title: "Graph Annotations",
      of: [
        {
          type: "object",
          fields: [
            {
              type: "string",
              name: "title",
              title: "Title",
            },
            {
              type: "string",
              name: "description",
              title: "Description",
            },
            {
              type: "date",
              name: "date_from",
              title: "Date From",
            },
            {
              type: "date",
              name: "date_to",
              title: "Date To",
            },
          ],
        },
      ],
    },
    {
      type: "graphcontext",
      name: "graphcontext",
      title: "Graph Context",
    },
    {
      type: "array",
      title: "Organization links",
      description: "Matches the organization on abreviation and inserts the provided link",
      name: "organization_links",
      of: [
        {
          type: "object",
          fields: [
            {
              type: "string",
              name: "abbreviation",
              title: "Org Abbreviation",
              options: {
                list: [
                  "agf",
                  "amf",
                  "drift",
                  "dtw",
                  "end",
                  "fem",
                  "gd",
                  "gdzf",
                  "gdcaf",
                  "hki",
                  "mc",
                  "ni",
                  "nls",
                  "phc",
                  "sci",
                  "sight",
                  "tcf",
                  "ubi",
                ],
              },
            },
            {
              type: "navitem",
              name: "link",
              title: "Link",
            },
          ],
        },
      ],
    },
    {
      type: "links",
      name: "links",
      title: "Links",
    },
  ],
  preview: {
    select: {
      title: "outputType",
      subtitle: "description",
    },
  },
};
