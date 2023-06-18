type Props = {
  fill: string;
  size: string;
};

export default function ProfileSvg({ fill = "#000", size }: Props) {
  return (
    <svg
      width={size}
      height={size}
      fill={fill}
      viewBox="0 0 20 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      //   xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>profile [#1336]</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill={fill}
        fill-rule="evenodd"
      >
        <g
          id="Dribbble-Light-Preview"
          transform="translate(-380.000000, -2159.000000)"
          fill={fill}
        >
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path
              d="M334,2011 C337.785,2011 340.958,2013.214 341.784,2017 L326.216,2017 C327.042,2013.214 330.215,2011 334,2011 M330,2005 C330,2002.794 331.794,2001 334,2001 C336.206,2001 338,2002.794 338,2005 C338,2007.206 336.206,2009 334,2009 C331.794,2009 330,2007.206 330,2005 M337.758,2009.673 C339.124,2008.574 340,2006.89 340,2005 C340,2001.686 337.314,1999 334,1999 C330.686,1999 328,2001.686 328,2005 C328,2006.89 328.876,2008.574 330.242,2009.673 C326.583,2011.048 324,2014.445 324,2019 L344,2019 C344,2014.445 341.417,2011.048 337.758,2009.673"
              id="profile-[#1336]"
            ></path>
          </g>
        </g>
      </g>
    </svg>
    // Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools
  );
}
